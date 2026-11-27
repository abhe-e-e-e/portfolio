# Abhiram S. Smitha Portfolio

A cinematic portfolio for a Computer Science student focused on product thinking, AI automation, cybersecurity, and startup execution. Built with Next.js, React, Framer Motion, GSAP, Three.js, and React Three Fiber.

## Features

- Static-export Next.js setup for free Netlify deployment
- Dark, responsive interface with motion-led hero visuals
- React Three Fiber hero scene
- Cinematic loading screen, animated cursor, parallax, scroll reveals, and animated figures
- Interactive experience, skills, projects, and dynamic resume sections
- SEO metadata, Open Graph tags, favicon, and Netlify Forms contact support
- Netlify Forms compatible contact form

## Local Development

The project grid retains the six original projects. Decor Pack is listed only
as ongoing freelance work; no project files or demo links are included.
AI.AT.CORE experience details follow the updated resume, including the status
of work in development and the scope of reported model accuracy.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
```

The static site is exported to the `out` folder.

## Netlify Deployment

Use these settings on Netlify:

- Build command: `npm run build`
- Publish directory: `out`
- Node version: `20`

The included `netlify.toml` already configures these values. The contact form uses Netlify Forms, so deploy the site to Netlify and submit the form once to let Netlify detect it. Form submissions appear in the Netlify dashboard under Forms.

## Personal Links

Primary content and profile links live in `components/CinematicPortfolio.jsx`. The resume is rendered dynamically on the page rather than distributed as a PDF.
