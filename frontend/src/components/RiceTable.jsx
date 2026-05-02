import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { IMPACT_OPTIONS, riceScore } from "../lib/frameworks";

const COLUMNS = [
  { id: "title", label: "Title", align: "left" },
  { id: "reach", label: "Reach", align: "right" },
  { id: "impact", label: "Impact", align: "right" },
  { id: "confidence", label: "Confidence %", align: "right" },
  { id: "effort", label: "Effort", align: "right" },
  { id: "score", label: "Score", align: "right" },
];

const fmt = (n) => {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1000) return n.toFixed(0);
  return n.toFixed(1);
};

export const RiceTable = ({ items, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [sort, setSort] = useState({ col: "score", dir: "desc" });
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    reach: 1000,
    impact: 1,
    confidence: 80,
    effort: 2,
  });

  const rows = useMemo(() => {
    const withScore = items.map((it) => ({ ...it, score: riceScore(it) }));
    const { col, dir } = sort;
    const mul = dir === "asc" ? 1 : -1;
    return withScore.sort((a, b) => {
      const av = a[col] ?? "";
      const bv = b[col] ?? "";
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * mul;
      }
      return String(av).localeCompare(String(bv)) * mul;
    });
  }, [items, sort]);

  const toggleSort = (col) => {
    setSort((s) =>
      s.col === col
        ? { col, dir: s.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "desc" },
    );
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onAddItem(draft);
    setDraft({
      title: "",
      description: "",
      reach: 1000,
      impact: 1,
      confidence: 80,
      effort: 2,
    });
  };

  return (
    <div className="space-y-6" data-testid="rice-table-container">
      <form
        onSubmit={handleAdd}
        data-testid="rice-add-form"
        className="grid grid-cols-1 md:grid-cols-12 gap-2 p-4 border border-border rounded-md bg-secondary/30"
      >
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="New item title"
          required
          data-testid="rice-add-title"
          className="md:col-span-3 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Short description (optional)"
          data-testid="rice-add-description"
          className="md:col-span-3 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="number"
          min="0"
          value={draft.reach}
          onChange={(e) => setDraft({ ...draft, reach: Number(e.target.value) })}
          placeholder="Reach"
          data-testid="rice-add-reach"
          className="md:col-span-1 h-10 rounded-md border border-border bg-background px-3 text-sm text-right"
        />
        <select
          value={draft.impact}
          onChange={(e) => setDraft({ ...draft, impact: Number(e.target.value) })}
          data-testid="rice-add-impact"
          className="md:col-span-2 h-10 rounded-md border border-border bg-background px-2 text-sm"
        >
          {IMPACT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          max="100"
          value={draft.confidence}
          onChange={(e) =>
            setDraft({ ...draft, confidence: Number(e.target.value) })
          }
          placeholder="Conf %"
          data-testid="rice-add-confidence"
          className="md:col-span-1 h-10 rounded-md border border-border bg-background px-3 text-sm text-right"
        />
        <input
          type="number"
          min="0.25"
          step="0.25"
          value={draft.effort}
          onChange={(e) => setDraft({ ...draft, effort: Number(e.target.value) })}
          placeholder="Effort"
          data-testid="rice-add-effort"
          className="md:col-span-1 h-10 rounded-md border border-border bg-background px-3 text-sm text-right"
        />
        <button
          type="submit"
          data-testid="rice-add-submit"
          className="md:col-span-1 h-10 rounded-md bg-foreground text-background text-sm font-medium flex items-center justify-center gap-1 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <div className="border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-testid="rice-table"
          >
            <thead className="bg-secondary/60 border-b border-border">
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c.id}
                    onClick={() => toggleSort(c.id)}
                    className={`px-4 py-3 font-editorial font-medium text-sm cursor-pointer select-none ${
                      c.align === "right" ? "text-right" : "text-left"
                    }`}
                    data-testid={`rice-sort-${c.id}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      {sort.col === c.id &&
                        (sort.dir === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </span>
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 1}
                    className="px-4 py-10 text-center text-muted-foreground text-sm"
                  >
                    No items yet. Add one above.
                  </td>
                </tr>
              )}
              {rows.map((it) => (
                <tr
                  key={it.id}
                  data-testid={`rice-row-${it.id}`}
                  className="border-b border-border last:border-0 hover:bg-accent/40"
                >
                  <td className="px-4 py-3 align-top">
                    <input
                      value={it.title}
                      onChange={(e) =>
                        onUpdateItem(it.id, { title: e.target.value })
                      }
                      data-testid={`rice-row-title-${it.id}`}
                      className="w-full bg-transparent font-editorial text-base leading-snug focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 -mx-1"
                    />
                    <input
                      value={it.description || ""}
                      placeholder="Add a note…"
                      onChange={(e) =>
                        onUpdateItem(it.id, { description: e.target.value })
                      }
                      data-testid={`rice-row-description-${it.id}`}
                      className="mt-1 w-full bg-transparent text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 -mx-1"
                    />
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <input
                      type="number"
                      min="0"
                      value={it.reach}
                      onChange={(e) =>
                        onUpdateItem(it.id, { reach: Number(e.target.value) })
                      }
                      data-testid={`rice-row-reach-${it.id}`}
                      className="w-24 h-8 text-right rounded border border-transparent hover:border-border focus:border-ring focus:outline-none bg-transparent px-2"
                    />
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <select
                      value={it.impact}
                      onChange={(e) =>
                        onUpdateItem(it.id, { impact: Number(e.target.value) })
                      }
                      data-testid={`rice-row-impact-${it.id}`}
                      className="h-8 rounded border border-transparent hover:border-border focus:border-ring focus:outline-none bg-transparent text-right pr-1"
                    >
                      {IMPACT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.value}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={it.confidence}
                      onChange={(e) =>
                        onUpdateItem(it.id, {
                          confidence: Number(e.target.value),
                        })
                      }
                      data-testid={`rice-row-confidence-${it.id}`}
                      className="w-20 h-8 text-right rounded border border-transparent hover:border-border focus:border-ring focus:outline-none bg-transparent px-2"
                    />
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <input
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={it.effort}
                      onChange={(e) =>
                        onUpdateItem(it.id, { effort: Number(e.target.value) })
                      }
                      data-testid={`rice-row-effort-${it.id}`}
                      className="w-20 h-8 text-right rounded border border-transparent hover:border-border focus:border-ring focus:outline-none bg-transparent px-2"
                    />
                  </td>
                  <td
                    className="px-4 py-3 text-right font-editorial text-lg align-top tabular-nums"
                    data-testid={`rice-row-score-${it.id}`}
                  >
                    {fmt(it.score)}
                  </td>
                  <td className="px-2 py-3 align-top">
                    <button
                      type="button"
                      title="Delete item"
                      data-testid={`rice-row-delete-${it.id}`}
                      onClick={() => onDeleteItem(it.id)}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-muted-foreground font-mono-system">
        score = (reach × impact × confidence) ÷ effort
      </div>
    </div>
  );
};

export default RiceTable;
