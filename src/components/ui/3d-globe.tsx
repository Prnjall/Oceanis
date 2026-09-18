
import { useRef, useMemo, useState, useCallback, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";


// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label?: string;
  size?: number;
}

export interface Globe3DConfig {
  /** Globe radius */
  radius?: number;
  /** Globe base color (used as fallback or tint) */
  globeColor?: string;
  /** URL to the Earth texture map */
  textureUrl?: string;
  /** URL to the bump/elevation map for terrain */
  bumpMapUrl?: string;
  /** Whether to show atmosphere glow */
  showAtmosphere?: boolean;
  /** Atmosphere color */
  atmosphereColor?: string;
  /** Atmosphere intensity */
  atmosphereIntensity?: number;
  /** Atmosphere blur/softness (higher = more diffuse, default 3) */
  atmosphereBlur?: number;
  /** Terrain bump scale (0 = flat, higher = more pronounced) */
  bumpScale?: number;
  /** Auto rotate speed (0 = disabled) */
  autoRotateSpeed?: number;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Min zoom distance */
  minDistance?: number;
  /** Max zoom distance */
  maxDistance?: number;
  /** Initial rotation */
  initialRotation?: { x: number; y: number };
  /** Marker default size */
  markerSize?: number;
  /** Show wireframe overlay */
  showWireframe?: boolean;
  /** Wireframe color */
  wireframeColor?: string;
  /** Ambient light intensity */
  ambientIntensity?: number;
  /** Point light intensity */
  pointLightIntensity?: number;
  /** Background color (null for transparent) */
  backgroundColor?: string | null;
}

interface Globe3DProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Globe configuration */
  config?: Globe3DConfig;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a marker is clicked */
  onMarkerClick?: (marker: GlobeMarker) => void;
  /** Callback when a marker is hovered */
  onMarkerHover?: (marker: GlobeMarker | null) => void;
  /** Marker to focus on */
  focusMarker?: GlobeMarker | null;
}

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

// ============================================================================
// Utility Functions
// ============================================================================

function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  // Three.js SphereGeometry UV mapping: u=0 (left edge of texture) = -180°W.
  // Therefore theta = (lng + 180) * PI/180 maps correctly:
  // lng=0° (Prime Meridian) → theta=180° → (-X, Z=0) → u=0.5 ✓
  // lng=90°E (India)         → theta=270° → (X=0, -Z)  → u=0.75 ✓
  // lng=-90°W (Americas)     → theta=90°  → (X=0, +Z)  → u=0.25 ✓
  const theta = (lng + 180) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Marker Component (static - rotation handled by parent group)
// ============================================================================

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  isActive?: boolean;
  onClick?: (marker: GlobeMarker) => void;
}

// Simple red-dot + line marker, fully in Three.js (no Html overlay)
function Marker({ marker, radius, isActive = false, onClick }: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [visible, setVisible] = useState(true);

  // Surface position
  const surfacePos = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, radius * 1.002),
    [marker.lat, marker.lng, radius]
  );

  // Dot position (slightly above surface)
  const dotPos = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, radius * 1.045),
    [marker.lat, marker.lng, radius]
  );

  // Line from surface to dot
  const lineHeight = dotPos.distanceTo(surfacePos);
  const lineCenter = useMemo(() => surfacePos.clone().lerp(dotPos, 0.5), [surfacePos, dotPos]);
  const lineQuaternion = useMemo(() => {
    const dir = dotPos.clone().sub(surfacePos).normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return q;
  }, [surfacePos, dotPos]);

  // Hide when behind globe
  useFrame(() => {
    if (!groupRef.current) return;
    const markerDir = dotPos.clone().normalize();
    const camDir = camera.position.clone().normalize();
    setVisible(markerDir.dot(camDir) > 0.05);
  });

  // Pulse animation for active dot
  useFrame(({ clock }) => {
    if (!dotRef.current) return;
    const t = clock.getElapsedTime();
    const baseScale = isActive ? 1 + 0.25 * Math.sin(t * 3) : 1;
    dotRef.current.scale.setScalar(baseScale);
  });

  const handleClick = useCallback(() => onClick?.(marker), [marker, onClick]);

  return (
    <group ref={groupRef} visible={visible}>
      {/* Vertical line from surface to dot */}
      <mesh position={lineCenter} quaternion={lineQuaternion}>
        <cylinderGeometry args={[0.004, 0.004, lineHeight, 6]} />
        <meshBasicMaterial
          color={isActive ? "#ff4444" : "#94a3b8"}
          transparent
          opacity={isActive ? 1.0 : 0.55}
        />
      </mesh>

      {/* Red dot at the top of the line */}
      <mesh
        ref={dotRef}
        position={dotPos}
        onClick={handleClick}
        onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { document.body.style.cursor = "default"; }}
      >
        <sphereGeometry args={[isActive ? 0.032 : 0.022, 12, 12]} />
        <meshBasicMaterial color={isActive ? "#ff2222" : "#ef4444"} />
      </mesh>

      {/* Outer glow ring when active */}
      {isActive && (
        <mesh position={dotPos}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

// ============================================================================
// Rotating Globe with Markers (all rotate together)
// ============================================================================

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  activeMarkerLatLng?: { lat: number; lng: number } | null;
  onMarkerClick?: (marker: GlobeMarker) => void;
}

function RotatingGlobe({
  config,
  markers,
  activeMarkerLatLng,
  onMarkerClick,
}: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load Earth textures
  const [earthTexture, bumpTexture] = useTexture([
    config.textureUrl,
    config.bumpMapUrl,
  ]);

  // Configure textures
  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 8;
    }
  }, [earthTexture, bumpTexture]);

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 64, 64);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  return (
    <group ref={groupRef}>
      {/* Main globe mesh with Earth texture */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Wireframe overlay */}
      {config.showWireframe && (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* Markers — compare by lat/lng so object-reference churn doesn't break active state */}
      {markers.map((marker, index) => {
        const isActive =
          activeMarkerLatLng != null &&
          Math.abs(marker.lat - activeMarkerLatLng.lat) < 0.001 &&
          Math.abs(marker.lng - activeMarkerLatLng.lng) < 0.001;
        return (
          <Marker
            key={`marker-${index}-${marker.lat}-${marker.lng}`}
            marker={marker}
            radius={config.radius}
            isActive={isActive}
            onClick={onMarkerClick}
          />
        );
      })}
    </group>
  );
}

// ============================================================================
// Atmosphere Component (stays static - doesn't rotate)
// ============================================================================

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  // blur controls the fresnel exponent: lower = more diffuse, higher = sharper edge
  // We invert it so higher blur value = more diffuse (lower exponent)
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
  focusMarker?: GlobeMarker | null;
}

function Scene({ markers, config, onMarkerClick, onMarkerHover: _onMarkerHover, focusMarker }: SceneProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // useRef-based animation target — no re-renders, always fresh in useFrame
  const targetSph = useRef<THREE.Spherical | null>(null);
  const isAnimating = useRef(false);
  const didInit = useRef(false);

  // Convert focusMarker lat/lng → camera Spherical every time focusMarker changes
  useEffect(() => {
    if (!focusMarker) return;

    const phi = (90 - focusMarker.lat) * (Math.PI / 180);
    // THREE.Spherical: x = r*sin(phi)*sin(theta), z = r*sin(phi)*cos(theta)
    // latLngToVector3:  x = r*sin(phi)*cos(theta_m), z = r*sin(phi)*sin(theta_m)
    // Camera must be opposite the marker → theta_cam = (90 - lng) * PI/180
    const theta = (90 - focusMarker.lng) * (Math.PI / 180);
    const r = camera.position.length() || config.radius * 3.5;

    if (!didInit.current) {
      // First load — snap immediately
      camera.position.setFromSphericalCoords(r, phi, theta);
      camera.lookAt(0, 0, 0);
      controlsRef.current?.update();
      didInit.current = true;
    } else {
      // Subsequent year changes — animate
      targetSph.current = new THREE.Spherical(r, phi, theta);
      isAnimating.current = true;
    }
  }, [focusMarker, config.radius, camera]);

  // Smooth animation loop — runs every frame, driven by ref (never stale)
  useFrame(() => {
    if (!isAnimating.current || !targetSph.current || !controlsRef.current) return;

    const cur = new THREE.Spherical().setFromVector3(camera.position);

    let dTheta = targetSph.current.theta - cur.theta;
    while (dTheta > Math.PI) dTheta -= Math.PI * 2;
    while (dTheta < -Math.PI) dTheta += Math.PI * 2;
    const dPhi = targetSph.current.phi - cur.phi;

    // Lerp at 8% per frame — feels smooth but reaches target in ~40 frames
    cur.theta += dTheta * 0.08;
    cur.phi += dPhi * 0.08;

    camera.position.setFromSpherical(cur);
    camera.lookAt(0, 0, 0);
    controlsRef.current.update();

    if (Math.abs(dTheta) < 0.002 && Math.abs(dPhi) < 0.002) {
      isAnimating.current = false;
      targetSph.current = null;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      {/* Globe with Markers */}
      <RotatingGlobe
        config={config}
        markers={markers}
        activeMarkerLatLng={focusMarker ? { lat: focusMarker.lat, lng: focusMarker.lng } : null}
        onMarkerClick={onMarkerClick}
      />

      {/* Atmosphere */}
      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      {/* OrbitControls — cancel anim on manual drag */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        enableRotate={true}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.5}
        autoRotate={!isAnimating.current && config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.08}
        onStart={() => { isAnimating.current = false; targetSph.current = null; }}
      />
    </>
  );
}

// ============================================================================
// Loading Fallback
// ============================================================================

function LoadingFallback() {
  // Suspense inside Canvas: just return null while textures load.
  // No Html wrapper needed — globe appears once textures are ready.
  return null;
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  globeColor: "#1a1a2e",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: false,
  atmosphereColor: "#4da6ff",
  atmosphereIntensity: 0.5,
  atmosphereBlur: 2,
  bumpScale: 1,
  autoRotateSpeed: 0.3,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0, y: 0 },
  markerSize: 0.06,
  showWireframe: false,
  wireframeColor: "#4a9eff",
  ambientIntensity: 0.6,
  pointLightIntensity: 1.5,
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
  focusMarker,
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  return (
    <div className={`relative h-[500px] w-full${className ? ` ${className}` : ""}`}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.5],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            markers={markers}
            config={mergedConfig}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
            focusMarker={focusMarker}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;
