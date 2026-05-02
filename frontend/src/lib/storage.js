// LocalStorage-backed data layer for Clarity Prioritise.
// No network calls, no analytics, nothing leaves the browser.

import { FRAMEWORKS, defaultItemForFramework } from "./frameworks";

const VALID_FRAMEWORKS = new Set(Object.values(FRAMEWORKS));

const STORAGE_KEY = "clarity-prioritise:v1";
const THEME_KEY = "clarity-prioritise:theme";

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeRaw(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedState() {
  const boardId = uid();
  const items = [
    {
      id: uid(),
      title: "Onboarding checklist",
      description: "Step-by-step guide for new users in the first session.",
      reach: 8000,
      impact: 2,
      confidence: 80,
      effort: 3,
    },
    {
      id: uid(),
      title: "Dark mode",
      description: "System-aware dark theme across the app.",
      reach: 12000,
      impact: 1,
      confidence: 90,
      effort: 2,
    },
    {
      id: uid(),
      title: "CSV export",
      description: "Let users export their data as CSV for spreadsheets.",
      reach: 3500,
      impact: 0.5,
      confidence: 70,
      effort: 1,
    },
    {
      id: uid(),
      title: "Keyboard shortcuts",
      description: "Power-user shortcuts for common actions.",
      reach: 2000,
      impact: 1,
      confidence: 60,
      effort: 2,
    },
    {
      id: uid(),
      title: "Team workspaces",
      description: "Multi-user accounts with shared boards.",
      reach: 15000,
      impact: 3,
      confidence: 40,
      effort: 12,
    },
  ];
  return {
    version: 1,
    activeBoardId: boardId,
    boards: [
      {
        id: boardId,
        name: "Q2 Roadmap Draft",
        framework: FRAMEWORKS.RICE,
        createdAt: new Date().toISOString(),
        items,
      },
    ],
  };
}

export function loadState() {
  let s = readRaw();
  if (!s || !Array.isArray(s.boards) || s.boards.length === 0) {
    s = seedState();
    writeRaw(s);
  }
  if (!s.activeBoardId || !s.boards.find((b) => b.id === s.activeBoardId)) {
    s.activeBoardId = s.boards[0].id;
  }
  return s;
}

export function saveState(state) {
  writeRaw(state);
  return state;
}

export function createBoard(state, { name, framework }) {
  const b = {
    id: uid(),
    name: name?.trim() || "Untitled board",
    framework: framework || FRAMEWORKS.RICE,
    createdAt: new Date().toISOString(),
    items: [],
  };
  const next = {
    ...state,
    boards: [...state.boards, b],
    activeBoardId: b.id,
  };
  saveState(next);
  return next;
}

export function renameBoard(state, boardId, name) {
  const next = {
    ...state,
    boards: state.boards.map((b) =>
      b.id === boardId ? { ...b, name: name.trim() || b.name } : b,
    ),
  };
  saveState(next);
  return next;
}

export function deleteBoard(state, boardId) {
  const boards = state.boards.filter((b) => b.id !== boardId);
  let activeBoardId = state.activeBoardId;
  if (activeBoardId === boardId) {
    activeBoardId = boards[0]?.id || null;
  }
  let next = { ...state, boards, activeBoardId };
  if (boards.length === 0) {
    // ensure there is always at least one board
    const seed = seedState();
    next = seed;
  }
  saveState(next);
  return next;
}

export function setActiveBoard(state, boardId) {
  const next = { ...state, activeBoardId: boardId };
  saveState(next);
  return next;
}

function updateBoardItems(state, boardId, updater) {
  const next = {
    ...state,
    boards: state.boards.map((b) =>
      b.id === boardId ? { ...b, items: updater(b.items) } : b,
    ),
  };
  saveState(next);
  return next;
}

export function addItem(state, boardId, partial) {
  const board = state.boards.find((b) => b.id === boardId);
  if (!board) return state;
  const item = {
    id: uid(),
    title: partial.title?.trim() || "Untitled item",
    description: partial.description?.trim() || "",
    ...defaultItemForFramework(board.framework),
    ...partial,
  };
  return updateBoardItems(state, boardId, (items) => [...items, item]);
}

export function updateItem(state, boardId, itemId, patch) {
  return updateBoardItems(state, boardId, (items) =>
    items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
  );
}

export function deleteItem(state, boardId, itemId) {
  return updateBoardItems(state, boardId, (items) =>
    items.filter((it) => it.id !== itemId),
  );
}

// Import / Export -- board-level JSON
export function exportBoard(board) {
  const payload = {
    app: "clarity-prioritise",
    version: 1,
    exportedAt: new Date().toISOString(),
    board,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safe = (board.name || "board").replace(/[^a-z0-9-_]+/gi, "-");
  a.download = `clarity-${safe}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBoardFromJson(state, jsonText) {
  const parsed = JSON.parse(jsonText);
  const incoming = parsed?.board || parsed;
  if (!incoming || !incoming.framework || !Array.isArray(incoming.items)) {
    throw new Error("File does not look like a Clarity board export.");
  }
  if (!VALID_FRAMEWORKS.has(incoming.framework)) {
    throw new Error(
      `Unknown framework "${incoming.framework}". Expected one of: ${[...VALID_FRAMEWORKS].join(", ")}.`,
    );
  }
  const board = {
    id: uid(),
    name: (incoming.name || "Imported board") + " (imported)",
    framework: incoming.framework,
    createdAt: new Date().toISOString(),
    items: incoming.items.map((it) => ({ ...it, id: it.id || uid() })),
  };
  const next = {
    ...state,
    boards: [...state.boards, board],
    activeBoardId: board.id,
  };
  saveState(next);
  return next;
}

// Theme
export function loadTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark") return t;
  } catch (err) {
    console.warn("clarity-prioritise: could not read theme from localStorage", err);
  }
  return "light";
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.warn("clarity-prioritise: could not persist theme to localStorage", err);
  }
}
