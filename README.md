# Unclutter showcase

A static browser-only showcase with Home, Try It Yourself and Architecture pages. Explore 50 authored fictional emails, preset classifications and manual category corrections. Message changes live in this tab and reset on reload. No account or external service is connected.

## Run locally

Use Node 24. Run `npm ci`, `npm run build` and `npm run preview`, then open `http://127.0.0.1:4173/Unclutter-Showcase/`. Build output is in `dist/`. The project base is case-sensitive: `/Unclutter-Showcase/`. Each page has a static HTML entry for direct navigation.

## Checks

Run `npm run typecheck`, `npm run lint`, `npm run audit` and `npm test`. Browser tests require Playwright Chromium (`npx playwright install chromium`).

## Dependencies

React and React DOM are MIT licensed. Inter is licensed under SIL OFL 1.1. Their notices are preserved in `public/THIRD_PARTY_NOTICES.txt` and the build output.
