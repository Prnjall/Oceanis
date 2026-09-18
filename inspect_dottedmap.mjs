// Inspect dotted-map internal projection - uses require for CJS
const { default: DottedMap } = await import('./node_modules/dotted-map/dist/index.mjs');

const map = new DottedMap({ height: 100, grid: 'diagonal' });

console.log('=== dotted-map Internal State ===');
console.log('width:', map.width);
console.log('height:', map.height);
console.log('X_MIN:', map.X_MIN);
console.log('X_RANGE:', map.X_RANGE);
console.log('Y_MAX:', map.Y_MAX);
console.log('Y_RANGE:', map.Y_RANGE);
console.log('ystep:', map.ystep);
console.log('proj4String:', map.proj4String);

const svgStr = map.getSVG({ radius: 0.22, color: '#fff', shape: 'circle', backgroundColor: 'transparent' });
const startIdx = svgStr.indexOf('viewBox="') + 9;
const endIdx = svgStr.indexOf('"', startIdx);
console.log('SVG viewBox:', svgStr.substring(startIdx, endIdx));

const incidents = [
  { year: 1993, lat: 19.0, lng: 71.5, label: 'Bombay High' },
  { year: 2010, lat: 18.86439, lng: 72.82, label: 'Mumbai' },
  { year: 2011, lat: 19.1175, lng: 72.10917, label: 'Mumbai-Uran' },
  { year: 2017, lat: 13.22817, lng: 80.36333, label: 'Ennore, Chennai' },
  { year: 2023, lat: 13.232, lng: 80.324, label: 'Ennore Creek' },
];

console.log('\n=== getPin() results (TRUE internal coords) ===');
incidents.forEach(inc => {
  const pin = map.getPin({ lat: inc.lat, lng: inc.lng });
  if (pin) {
    console.log(`${inc.year} ${inc.label}: x=${pin.x.toFixed(3)} y=${pin.y.toFixed(3)} (snapped lat=${pin.lat.toFixed(4)} lng=${pin.lng.toFixed(4)})`);
  } else {
    console.log(`${inc.year} ${inc.label}: getPin returned null`);
  }
});

// Compare with wrong equirectangular formula
console.log('\n=== Equirectangular formula (current - probably wrong) ===');
incidents.forEach(inc => {
  const x = (inc.lng + 180) * (800 / 360);
  const y = (90 - inc.lat) * (400 / 180);
  console.log(`${inc.year} ${inc.label}: equirect x=${x.toFixed(1)} y=${y.toFixed(1)}`);
});
