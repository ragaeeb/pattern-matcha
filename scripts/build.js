/* eslint-disable */

import fs from 'fs';

const REGEX_RULES_FILE = 'regexRules.json';
const [, , srcFolder, distFolder] = process.argv;

fs.copyFileSync(`${srcFolder}/rules.d.ts`, `${distFolder}/rules.d.ts`);

const rules = JSON.parse(fs.readFileSync(`${srcFolder}/${REGEX_RULES_FILE}`));
const optimizedRules = rules.map(({ timestamp, last_updated, description, ...r }) => r);
fs.writeFileSync(`${distFolder}/${REGEX_RULES_FILE}`, JSON.stringify(optimizedRules));
