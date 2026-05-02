# Clarity Prioritise - PRD

## Problem

Product teams need lightweight ways to prioritise ideas. Most existing tools require an account, a subscription, and a willingness to hand product data to a vendor. For sensitive roadmaps, internal tools, or quick personal use, that trade-off is too high.

Clarity Prioritise gives product people three established prioritisation frameworks in a single page web app. Everything runs in the browser. No accounts, no tracking, no data leaving the device.

## Architecture

Frontend: Create React App, React 19, Tailwind CSS, React Router DOM (routes for `/` and `/about`).

State: useState hooks plus localStorage under the key `clarity-prioritise:v1`.

Theme: dark class on `<html>`, persisted to `clarity-prioritise:theme`.

No backend. All data stays in the browser.

## Core requirements

Three frameworks: RICE as a sortable editable table, Kano as grouped columns, Value vs Effort as a custom SVG 2x2 scatter plot with a sorted list.

Multiple boards with a sidebar to create, rename, and delete. Each board shows its framework as a badge.

Import and export per board as JSON.

Light and dark mode toggle, saved to localStorage.

Editorial design with a serif-forward minimal feel and a neutral zinc palette. No gradients.

Fully responsive with a mobile drawer sidebar and a top bar.

About page that explains the privacy model in plain English.

No external HTTP requests from the app. Google Fonts link removed from index.html.

## Implemented

`src/lib/frameworks.js` — scoring logic and framework constants.

`src/lib/storage.js` — localStorage CRUD, seed board, import and export, theme.

`src/components/Sidebar.jsx` — boards list, rename and delete, export and import, theme toggle, navigation.

`src/components/BoardView.jsx` — dispatches the right view per framework.

`src/components/RiceTable.jsx` — sortable table with inline edit and an add form.

`src/components/KanoBoard.jsx` — five column grouped view with descriptions for each category.

`src/components/ValueEffortChart.jsx` — custom SVG 2x2 scatter plus a sorted table.

`src/components/About.jsx` — privacy page.

`src/components/NewBoardDialog.jsx` — create board dialog.

`App.js` — shell with router, mobile drawer, flash messages, and seed state.

Editorial typography via system serif fonts. Tailwind `font-editorial` utility.

`tailwind.config.js` extended with fontFamily and zinc-derived design tokens.

## Backlog

P1: inline item detail editor and keyboard shortcuts.

P1: duplicate board action.

P2: CSV export.

P2: empty-state SVG illustrations.

P2: keyboard navigation between boards.

## Test credentials

Not applicable. There is no authentication.
