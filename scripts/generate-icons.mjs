import { writeFileSync } from 'fs'
import { resolve } from 'path'
import sharp from 'sharp'

const sizes = [192, 512]

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4caf50"/>
      <stop offset="100%" stop-color="#b52e56"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#g)"/>
  <text x="256" y="340" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="280" font-weight="800" fill="white" text-anchor="middle">M</text>
</svg>
`

async function main() {
  for (const size of sizes) {
    const buffer = await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toBuffer()
    const outPath = resolve(process.cwd(), 'public', `icon-${size}x${size}.png`)
    writeFileSync(outPath, buffer)
    console.log(`Generated ${outPath}`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
