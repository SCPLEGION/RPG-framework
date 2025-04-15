// convert-swagger-to-yaml.mjs
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerDoc from './swagger-output.js'; // Ensure the file has the correct extension

const yamlStr = yaml.dump(swaggerDoc);

// Save to file
fs.writeFileSync('swagger.yaml', yamlStr, 'utf8');

console.log('✅ Swagger YAML saved to swagger.yaml');
