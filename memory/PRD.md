# Clarity Prioritise — PRD

## Problem Statement
Single-page web app for ranking product ideas using RICE, Kano, or Value vs Effort. 100% local (localStorage), no backend, no auth, no external calls, no fonts from Google, no tracking. Light/dark mode, import/export JSON, multiple boards, About page explaining privacy.

## Architecture
- Frontend: CRA + React 19 + Tailwind, React Router DOM (SPA routes `/`, `/about`)
- State: `useState` hooks + `localStorage` key `clarity-prioritise:v1`
- Theme: `dark` class on `<html>`, persisted to `clarity-prioritise:theme`
- No backend used. All data stays in browser.

## Core Requirements (static)
- Frameworks: RICE (sortable editable table), Kano (grouped columns), Value vs Effort (custom SVG scatter + list)
- Multiple boards: sidebar with create/rename/delete, framework badge per board
- Import/export JSON per board
- Light/dark toggle saved to localStorage
- Editorial serif-forward minimal design, neutral zinc palette, no gradients
- Fully responsive (mobile drawer sidebar, top bar)
- About page describing privacy model
- No external HTTP requests from the app; Google Fonts link removed from index.html

## Implemented — Feb 2026
- `src/lib/frameworks.js`: scoring + framework constants
- `src/lib/storage.js`: localStorage CRUD, seed board, import/export, theme
- `src/components/Sidebar.jsx`: boards list, rename/delete, export/import, theme, nav
- `src/components/BoardView.jsx`: dispatches per framework
- `src/components/RiceTable.jsx`: sortable table w/ inline edit + add form
- `src/components/KanoBoard.jsx`: 5-column grouped view w/ descriptions
- `src/components/ValueEffortChart.jsx`: custom SVG 2×2 scatter + sorted table
- `src/components/About.jsx`: privacy page
- `src/components/NewBoardDialog.jsx`: create dialog
- `App.js` shell with router, mobile drawer, flash messages, seed state
- Editorial typography via system serif; Tailwind `font-editorial` utility
- `tailwind.config.js` with fontFamily, zinc-derived tokens

## Backlog
- P1: Inline item detail editor / keyboard shortcuts
- P1: Duplicate board action
- P2: CSV export (mentioned as a seed item)
- P2: Confetti-free empty-state illustrations (SVG, no images)
- P2: Keyboard navigation between boards

## Test credentials
Not applicable (no auth).
