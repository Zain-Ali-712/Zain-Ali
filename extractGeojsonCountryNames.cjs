const fs = require('fs');

const geojson = JSON.parse(fs.readFileSync('public/assets/globe/countries.geojson', 'utf8'));
const names = new Set();

geojson.features.forEach(f => {
    if (f.properties.ADMIN) names.add(f.properties.ADMIN);
    if (f.properties.NAME) names.add(f.properties.NAME);
});

const arr = Array.from(names).sort();
const output = `export default [\n${arr.map(n => `  "${n.replace(/"/g, '\\"')}"`).join(',\n')}\n];\n`;

fs.writeFileSync('src/data/geojsonCountryNames.js', output);
console.log('Country names extracted and written to src/data/geojsonCountryNames.js');