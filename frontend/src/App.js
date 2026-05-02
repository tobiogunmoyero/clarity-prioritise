import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import "@/App.css";

import Sidebar from "@/components/Sidebar";
import BoardView from "@/components/BoardView";
import About from "@/components/About";
import NewBoardDialog from "@/components/NewBoardDialog";

import {
  addItem,
  createBoard,
  deleteBoard,
  deleteItem,
  exportBoard,
  importBoardFromJson,
  loadState,
  loadTheme,
  renameBoard,
  saveTheme,
  setActiveBoard,
  updateItem,
} from "@/lib/storage";

function useTheme() {
  const [theme, setTheme] = useState(() => loadTheme());
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    saveTheme(theme);
  }, [theme]);
  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );
  return { theme, toggle };
}

function Shell() {
  const [state, setState] = useState(() => loadState());
  const { theme, toggle } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flash, setFlash] = useState(null);
  const navigate = useNavigate();

  const activeBoard = useMemo(
    () => state.boards.find((b) => b.id === state.activeBoardId) || null,
    [state],
  );

  useEffect(() => {
    if (!flash) return undefined;
    const t = setTimeout(() => setFlash(null), 3200);
    return () => clearTimeout(t);
  }, [flash]);

  const handleSelect = (id) => {
    setState((s) => setActiveBoard(s, id));
    setSidebarOpen(false);
    navigate("/");
  };

  const handleNewBoard = () => setDialogOpen(true);

  const handleCreate = ({ name, framework }) => {
    setState((s) => createBoard(s, { name, framework }));
    setDialogOpen(false);
    navigate("/");
  };

  const handleRename = (id, name) =>
    setState((s) => renameBoard(s, id, name));

  const handleDelete = (id) => setState((s) => deleteBoard(s, id));

  const handleAddItem = (partial) =>
    setState((s) => addItem(s, s.activeBoardId, partial));

  const handleUpdateItem = (itemId, patch) =>
    setState((s) => updateItem(s, s.activeBoardId, itemId, patch));

  const handleDeleteItem = (itemId) =>
    setState((s) => deleteItem(s, s.activeBoardId, itemId));

  const handleExport = () => {
    if (!activeBoard) return;
    exportBoard(activeBoard);
    setFlash({ kind: "ok", text: `Exported "${activeBoard.name}" to JSON.` });
  };

  const handleImportFile = async (file) => {
    try {
      const text = await file.text();
      setState((s) => importBoardFromJson(s, text));
      setFlash({ kind: "ok", text: `Imported "${file.name}".` });
      navigate("/");
    } catch (err) {
      setFlash({
        kind: "err",
        text: `Could not import: ${err.message || "invalid file"}.`,
      });
    }
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row bg-background text-foreground">
      {/* Mobile top bar */}
      <div
        data-testid="topbar-mobile"
        className="md:hidden flex items-center justify-between border-b border-border px-4 py-3"
      >
        <div className="flex items-baseline gap-1.5">
          <span className="font-editorial text-lg tracking-tight">Clarity</span>
          <span className="font-editorial italic text-base text-muted-foreground">
            Prioritise
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          data-testid="topbar-mobile-menu"
          className="p-2 rounded-md border border-border"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Sidebar – desktop */}
      <div className="hidden md:block h-full">
        <Sidebar
          boards={state.boards}
          activeBoardId={state.activeBoardId}
          theme={theme}
          onToggleTheme={toggle}
          onSelectBoard={handleSelect}
          onNewBoard={handleNewBoard}
          onRenameBoard={handleRename}
          onDeleteBoard={handleDelete}
          onExport={handleExport}
          onImportFile={handleImportFile}
        />
      </div>

      {/* Sidebar – mobile drawer */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex"
          data-testid="sidebar-mobile-drawer"
        >
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] h-full">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              data-testid="sidebar-mobile-close"
              className="absolute top-3 right-3 z-10 p-1.5 rounded hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar
              boards={state.boards}
              activeBoardId={state.activeBoardId}
              theme={theme}
              onToggleTheme={toggle}
              onSelectBoard={handleSelect}
              onNewBoard={() => {
                setSidebarOpen(false);
                handleNewBoard();
              }}
              onRenameBoard={handleRename}
              onDeleteBoard={handleDelete}
              onExport={handleExport}
              onImportFile={handleImportFile}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto" data-testid="main-content">
        {flash && (
          <div
            data-testid={`flash-${flash.kind}`}
            className={`mx-6 mt-6 px-4 py-2 text-sm rounded-md border ${
              flash.kind === "ok"
                ? "border-border bg-secondary"
                : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            {flash.text}
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <BoardView
                board={activeBoard}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
              />
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <NewBoardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

export default App;
