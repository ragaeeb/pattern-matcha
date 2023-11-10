import fs from 'fs';

const REGEX_RULES_FILE = 'rules.json';
const [, , srcFolder, distFolder] = process.argv;

if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder, { recursive: true });
}

fs.copyFileSync(`${srcFolder}/rules.d.ts`, `${distFolder}/rules.d.ts`);

const rules = JSON.parse(fs.readFileSync(`${srcFolder}/${REGEX_RULES_FILE}`));
const optimizedRules = rules.map(({ timestamp, last_updated: lastUpdated, description, ...r }) => r);
fs.writeFileSync(`${distFolder}/${REGEX_RULES_FILE}`, JSON.stringify(optimizedRules));
