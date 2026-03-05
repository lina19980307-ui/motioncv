# MotionCV

Minimal yet expressive resume website generator.

MotionCV lets users fill in resume fields, upload media, preview in real time, and generate shareable resume links (`/resume/[slug]`) with bilingual display (Chinese/English).

## Highlights

- Structured resume editor:
  - Hero / About / Experience / Projects / Skills / Awards / Contact
  - Up to 3 custom sections with text + media
- Real-time preview:
  - Click preview section to jump to corresponding editor block
- Project timeline cards:
  - Optional image/video per project
  - Detail expand/collapse
- Media experience:
  - Carousel-style top media strip
  - Hover-focused card emphasis
- Sharing:
  - One-click publish to local snapshot + share URL
  - `/resume/[slug]` public-style view
- Language:
  - Chinese input with English output mode
- Persistence:
  - Draft autosave in `localStorage`
  - Return-to-editor keeps previous content

## Tech Stack

- Next.js 16 (Pages Router)
- React 19
- Tailwind CSS 4
- Intersection Observer (scroll reveal)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # start local dev server
npm run build   # production build
npm run start   # run production server
npm run lint    # lint
```

## How It Works

1. Fill the editor fields on the left side.
2. Click `生成网站` to refresh preview.
3. Click `一键发布` to generate a share URL.
4. Open the generated `/resume/[slug]` link.

## Media Limits

To avoid browser storage overflow:

- Image: up to `2MB` per file
- Video: up to `8MB` per file
- Main media: up to `6` files
- Custom section media: up to `6` files per section

If files exceed limits, UI shows immediate warning and skips oversized files.

## Local Storage Note

This project uses browser `localStorage` for draft/snapshot persistence.
Very large media files can exceed quota on some browsers.

## Deployment

Deploy with Vercel (recommended):

```bash
npx vercel --prod
```

Or push to GitHub and connect the repository in Vercel dashboard for automatic deployments.

## Project Structure

```text
motioncv/
  components/
  hooks/
  pages/
  styles/
  utils/
  resume.json
```

## License

MIT (or your preferred license).
