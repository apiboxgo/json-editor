import uk from './uk.js';
import en from './en.js';
import { config } from '../config/config.js';

const langs = { uk, en };
export const t = langs[config.language] || uk;
