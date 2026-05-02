import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  PlusCircle,
  Sun,
  Moon,
  Pencil,
  Trash2,
  Info,
  Download,
  Upload,
  FileText,
} from "lucide-react";
import { FRAMEWORK_META } from "../lib/frameworks";

export const Sidebar = ({
  boards,
  activeBoardId,
  theme,
  onToggleTheme,
  onSelectBoard,
  onNewBoard,
  onRenameBoard,
  onDeleteBoard,
  onExport,
  onImportFile,
}) => {
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const fileRef = useRef(null);

  const startRename = (b) => {
    setRenamingId(b.id);
    setRenameValue(b.name);
  };

  const commitRename = (b) => {
    if (renameValue.trim() && renameValue.trim() !== b.name) {
      onRenameBoard(b.id, renameValue.trim());
    }
    setRenamingId(null);
  };

  return (
    <aside
      data-testid="sidebar"
      className="h-full w-full md:w-72 shrink-0 border-r border-border bg-secondary/40 flex flex-col"
    >
      <div className="px-5 pt-6 pb-4 border-b border-border">
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-2xl tracking-tight text-foreground">
            Clarity
          </span>
          <span className="font-editorial italic text-xl text-muted-foreground">
            Prioritise
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          A quiet place to rank ideas.
        </p>
      </div>

      <div className="px-3 pt-3">
        <button
          type="button"
          data-testid="sidebar-new-board-button"
          onClick={onNewBoard}
          className="group w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-border bg-background hover:bg-accent transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="font-medium">New board</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Boards
        </div>
        {boards.map((b) => {
          const active = b.id === activeBoardId;
          const meta = FRAMEWORK_META[b.framework];
          return (
            <div
              key={b.id}
              data-testid={`sidebar-board-${b.id}`}
              className={`group relative rounded-md border transition-colors ${
                active
                  ? "border-border bg-background shadow-sm"
                  : "border-transparent hover:bg-accent/60"
              }`}
            >
              {renamingId === b.id ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => commitRename(b)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename(b);
                    if (e.key === "Escape") setRenamingId(null);
                  }}
                  data-testid={`sidebar-rename-input-${b.id}`}
                  className="w-full bg-transparent px-3 py-2 text-sm font-medium focus:outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectBoard(b.id)}
                  data-testid={`sidebar-select-board-${b.id}`}
                  className="w-full text-left px-3 py-2 pr-14"
                >
                  <div className="font-editorial text-[15px] leading-snug truncate">
                    {b.name}
                  </div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {meta?.label || b.framework} · {b.items.length} item
                    {b.items.length === 1 ? "" : "s"}
                  </div>
                </button>
              )}
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Rename"
                  data-testid={`sidebar-rename-button-${b.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    startRename(b);
                  }}
                  className="p-1.5 rounded hover:bg-accent"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Delete"
                  data-testid={`sidebar-delete-button-${b.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        `Delete board "${b.name}"? This cannot be undone.`,
                      )
                    ) {
                      onDeleteBoard(b.id);
                    }
                  }}
                  className="p-1.5 rounded hover:bg-accent text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="sidebar-export-button"
            onClick={onExport}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded-md border border-border hover:bg-accent transition-colors"
            title="Export active board as JSON"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button
            type="button"
            data-testid="sidebar-import-button"
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded-md border border-border hover:bg-accent transition-colors"
            title="Import a board from JSON"
          >
            <Upload className="h-3.5 w-3.5" /> Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            data-testid="sidebar-import-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportFile(f);
              e.target.value = "";
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <NavLink
            to="/about"
            data-testid="sidebar-about-link"
            className={({ isActive }) =>
              `flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-accent"
              }`
            }
          >
            <Info className="h-3.5 w-3.5" /> About
          </NavLink>
          <NavLink
            to="/"
            data-testid="sidebar-boards-link"
            end
            className={({ isActive }) =>
              `flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-accent"
              }`
            }
          >
            <FileText className="h-3.5 w-3.5" /> Boards
          </NavLink>
          <button
            type="button"
            data-testid="sidebar-theme-toggle"
            onClick={onToggleTheme}
            title="Toggle theme"
            className="p-1.5 rounded-md border border-border hover:bg-accent transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
