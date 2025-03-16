import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function getPublicPath() {
  return path.resolve(__dirname, '..', 'public');
}
export function getEmailTemplatePath(template) {
  return path.resolve(__dirname, '..', 'email-templates', template);
}
export default function formatZodError(error) {
  const fieldErrors = error.issues;
  const errorObject = {};
  fieldErrors.forEach((fieldError) => {
    const path = fieldError.path.join('.');
    errorObject[path] = fieldError.message;
  });
  const conciseErrorMessages = Object.entries(errorObject)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  return { conciseErrorMessages, errorObject };
}
export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}
