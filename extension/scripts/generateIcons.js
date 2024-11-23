const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// SVG content from our previous design
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="60" fill="#4F46E5" />
  <circle cx="64" cy="64" r="50" fill="#ffffff" fillOpacity="0.9" />
  <rect x="48" y="40" width="40" height="48" fill="#4F46E5" rx="4" />
  <rect x="54" y="48" width="28" height="2" fill="#ffffff" rx="1" />
  <rect x="54" y="54" width="28" height="2" fill="#ffffff" rx="1" />
  <rect x="54" y="60" width="20" height="2" fill="#ffffff" rx="1" />
  <path d="M64,64 L64,45" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
  <path d="M64,64 L75,64" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
  <circle cx="64" cy="40" r="2" fill="#4F46E5" />
  <circle cx="88" cy="64" r="2" fill="#4F46E5" />
  <circle cx="64" cy="88" r="2" fill="#4F46E5" />
  <circle cx="40" cy="64" r="2" fill="#4F46E5" />
</svg>
`;

async function generateIcons() {
    const sizes = [16, 32, 48, 128];
    const outputDir = path.join(__dirname, '../public/icons');

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Save source SVG
    await fs.writeFile(
        path.join(__dirname, '../src/assets/icons/icon.svg'),
        svgContent
    );

    // Generate PNGs
    for (const size of sizes) {
        await sharp(Buffer.from(svgContent))
            .resize(size, size)
            .png()
            .toFile(path.join(outputDir, `icon${size}.png`));

        console.log(`Generated ${size}x${size} icon`);
    }
}

generateIcons().catch(console.error);