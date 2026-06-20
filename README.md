# Gesture Navigator

A React app that lets you navigate between pages by drawing shapes on the screen — no buttons, no menus.

## How it works

Triple-tap anywhere on the screen to enter gesture mode. A dashed purple border appears — draw a shape, lift your finger, and you're navigated. Press `Esc` to cancel.

## Gestures

| Shape | Navigates to |
|-------|-------------|
| Circle ○ | /page1 |
| Triangle △ | /page2 |
| Check ✓ | /page3 |
| Caret ∧ | /page4 |
| Pigtail ρ | /page5 |
| Arrow → | /draw |

## Tech stack

- React + Vite
- React Router v6
- `$1 Unistroke Recognizer` — gesture recognition algorithm
- `js-yaml` — loads gesture config from `public/gesture-nav.yaml`

## Getting started

```bash
cd frontend
npm install
npm run dev
```
