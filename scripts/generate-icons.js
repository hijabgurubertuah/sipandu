import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#047857"/>
  <circle cx="256" cy="256" r="190" fill="#065f46" stroke="#34d399" stroke-width="8" stroke-dasharray="8 8"/>
  <circle cx="256" cy="256" r="170" fill="#ffffff"/>
  <!-- Medical Cross / Plus Symbol -->
  <path d="M226 128H286V226H384V286H286V384H226V286H128V226H226V128Z" fill="#059669"/>
  <!-- Center Heart or Star Emblem -->
  <circle cx="256" cy="256" r="32" fill="#047857"/>
  <path d="M256 242C259 238 266 238 269 242C272 246 272 252 268 256L256 268L244 256C240 252 240 246 243 242C246 238 253 238 256 242Z" fill="#34d399"/>
</svg>
`;

// Maskable with extra safe padding
const svgMaskableIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#047857"/>
  <circle cx="256" cy="256" r="140" fill="#ffffff"/>
  <!-- Medical Cross / Plus Symbol -->
  <path d="M232 150H280V232H362V280H280V362H232V280H150V232H232V150Z" fill="#059669"/>
  <circle cx="256" cy="256" r="26" fill="#047857"/>
  <path d="M256 245C258 241 264 241 266 245C268 248 268 253 265 256L256 265L247 256C244 253 244 248 246 245C248 241 254 241 256 245Z" fill="#34d399"/>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write SVG favicon
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon.trim());

  // 192x192
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 180x180 Apple touch icon
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Maskable 512x512
  await sharp(Buffer.from(svgMaskableIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'maskable-icon-512x512.png'));

  console.log('PWA icons successfully generated!');
}

generate().catch(console.error);
