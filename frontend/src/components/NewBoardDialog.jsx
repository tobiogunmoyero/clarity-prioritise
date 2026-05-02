import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FRAMEWORK_META, FRAMEWORKS } from "../lib/frameworks";

export const NewBoardDialog = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [framework, setFramework] = useState(FRAMEWORKS.RICE);

  useEffect(() => {
    if (open) {
      setName("");
      setFramework(FRAMEWORKS.RICE);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name: name || "Untitled board", framework });
  };

  return (
    <div
      data-testid="new-board-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-background border border-border rounded-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          data-testid="new-board-dialog-close"
          className="absolute right-3 top-3 p-1.5 rounded hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="px-7 pt-7 pb-4 border-b border-border">
          <h2 className="font-editorial text-2xl tracking-tight">New board</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a framework. You can rename the board any time.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-7 py-5 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
              Name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q3 Growth Backlog"
              data-testid="new-board-name-input"
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
              Framework
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(FRAMEWORK_META).map((m) => {
                const active = framework === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    data-testid={`new-board-framework-${m.id}`}
                    onClick={() => setFramework(m.id)}
                    className={`text-left px-4 py-3 rounded-md border transition-colors ${
                      active
                        ? "border-foreground bg-accent"
                        : "border-border hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-editorial text-lg">{m.label}</span>
                      {active && (
                        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                          selected
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {m.blurb}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              data-testid="new-board-cancel"
              className="px-4 py-2 text-sm rounded-md border border-border hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="new-board-submit"
              className="px-4 py-2 text-sm rounded-md bg-foreground text-background hover:opacity-90"
            >
              Create board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBoardDialog;
