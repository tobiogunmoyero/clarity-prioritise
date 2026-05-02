import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { KANO_CATEGORIES } from "../lib/frameworks";

export const KanoBoard = ({ items, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    category: "performance",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onAddItem(draft);
    setDraft({ title: "", description: "", category: draft.category });
  };

  const grouped = KANO_CATEGORIES.map((c) => ({
    ...c,
    items: items.filter((it) => (it.category || "performance") === c.id),
  }));

  return (
    <div className="space-y-6" data-testid="kano-board-container">
      <form
        onSubmit={handleAdd}
        data-testid="kano-add-form"
        className="grid grid-cols-1 md:grid-cols-12 gap-2 p-4 border border-border rounded-md bg-secondary/30"
      >
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="New item title"
          required
          data-testid="kano-add-title"
          className="md:col-span-4 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Short description (optional)"
          data-testid="kano-add-description"
          className="md:col-span-5 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          data-testid="kano-add-category"
          className="md:col-span-2 h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          {KANO_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          data-testid="kano-add-submit"
          className="md:col-span-1 h-10 rounded-md bg-foreground text-background text-sm font-medium flex items-center justify-center gap-1 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {grouped.map((g) => (
          <section
            key={g.id}
            data-testid={`kano-column-${g.id}`}
            className="border border-border rounded-md bg-background"
          >
            <header className="px-4 py-3 border-b border-border">
              <div className="flex items-baseline justify-between">
                <h3 className="font-editorial text-xl tracking-tight">
                  {g.label}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {g.items.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {g.description}
              </p>
            </header>
            <ul className="p-3 space-y-2 min-h-[80px]">
              {g.items.length === 0 && (
                <li className="text-xs text-muted-foreground italic px-1 py-2">
                  No items in this category.
                </li>
              )}
              {g.items.map((it) => (
                <li
                  key={it.id}
                  data-testid={`kano-item-${it.id}`}
                  className="group border border-border rounded-md p-3 bg-secondary/30 hover:bg-secondary/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <input
                      value={it.title}
                      onChange={(e) =>
                        onUpdateItem(it.id, { title: e.target.value })
                      }
                      data-testid={`kano-item-title-${it.id}`}
                      className="flex-1 bg-transparent font-editorial text-[15px] leading-snug focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 -mx-1"
                    />
                    <button
                      type="button"
                      onClick={() => onDeleteItem(it.id)}
                      data-testid={`kano-item-delete-${it.id}`}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent text-muted-foreground hover:text-destructive"
                      title="Delete item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    value={it.description || ""}
                    placeholder="Add a note…"
                    onChange={(e) =>
                      onUpdateItem(it.id, { description: e.target.value })
                    }
                    data-testid={`kano-item-description-${it.id}`}
                    className="mt-1 w-full bg-transparent text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 -mx-1"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Move to
                    </label>
                    <select
                      value={it.category || "performance"}
                      onChange={(e) =>
                        onUpdateItem(it.id, { category: e.target.value })
                      }
                      data-testid={`kano-item-category-${it.id}`}
                      className="h-7 text-xs rounded border border-border bg-background px-2"
                    >
                      {KANO_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default KanoBoard;
