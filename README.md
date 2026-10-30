# Niño Redoble · The Ride

The portfolio at [ninoredoble.is-a.dev](https://ninoredoble.is-a.dev/): scroll and the GNEGR motorcycle rides from dawn in Cagayan de Oro to dusk at a fork in the road, stopping at each place along the way. In the workshop the bike is taken apart and laid out, one part for each thing I bring.

People in a hurry can skip straight to the plain one-page summary at [`/summary/`](https://ninoredoble.is-a.dev/summary/), which needs no script and prints cleanly.

## How it works

- TypeScript, Vite, GSAP ScrollTrigger and Lenis.
- `index.html` holds every word on the page. The landscapes, road signs and the motorcycle are drawn by `src/art.ts` and written into the HTML at build time (`vite.config.ts`), so each scene shows before any script runs.
- `src/logo.ts` is the GNEGR motorcycle, traced from `public/img/gnegr.png` and cut into six parts along the gaps in the drawing. `public/img/gnegr.svg` is the same drawing as a single light vector.
- `src/ride.ts` is the choreography: one sticky stage, one scrubbed timeline. Each place wipes in over the last; its layers, road and sign move at their own speeds; in the workshop the bike parks and its parts fly onto the mat.
- On phones, on short or portrait screens, and for anyone who prefers reduced motion, the same scenes simply stack one after another with no scroll-jacking (`html` without `.is-ride`).

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and build to dist/
npm run preview
```

Add `?qa` to the URL to turn off smoothing and the intro, which makes screenshots land on exact frames.

## Deploy

`.github/workflows/deploy.yml` builds with Vite and publishes `dist/` to GitHub Pages on every push to `main`. `public/CNAME` keeps the custom domain.

## Credits

The scroll engine started from David Yen's MIT-licensed [portfolio](https://github.com/davidyen1124/portfolio); his copyright is kept in `LICENSE`. The story, art, motorcycle and words are new.
