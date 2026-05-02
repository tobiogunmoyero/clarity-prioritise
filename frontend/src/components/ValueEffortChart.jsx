import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  VE_QUADRANTS,
  valueEffortQuadrant,
  valueEffortScore,
} from "../lib/frameworks";

const QUADRANT_POSITION = {
  quick_wins: { x: "left", y: "top" }, // low effort, high value
  big_bets: { x: "right", y: "top" }, // high effort, high value
  fill_ins: { x: "left", y: "bottom" }, // low effort, low value
  time_sinks: { x: "right", y: "bottom" }, // high effort, low value
};

export const ValueEffortChart = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    value: 7,
    effort: 3,
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onAddItem(draft);
    setDraft({ title: "", description: "", value: 7, effort: 3 });
  };

  const rows = useMemo(() => {
    return items
      .map((it) => ({
        ...it,
        score: valueEffortScore(it),
        quadrant: valueEffortQuadrant(it.value, it.effort),
      }))
      .sort((a, b) => b.score - a.score);
  }, [items]);

  // SVG geometry: 10x10 data space → viewBox
  const W = 600;
  const H = 420;
  const PAD = 40;
  const chartW = W - PAD * 2;
  const chartH = H - PAD * 2;

  const toX = (effort) => PAD + (Number(effort) / 10) * chartW;
  const toY = (value) => PAD + (1 - Number(value) / 10) * chartH;

  return (
    <div className="space-y-6" data-testid="ve-chart-container">
      <form
        onSubmit={handleAdd}
        data-testid="ve-add-form"
        className="grid grid-cols-1 md:grid-cols-12 gap-2 p-4 border border-border rounded-md bg-secondary/30"
      >
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="New item title"
          required
          data-testid="ve-add-title"
          className="md:col-span-4 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Short description"
          data-testid="ve-add-description"
          className="md:col-span-4 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="md:col-span-1 flex items-center gap-2">
          <label className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Value
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={draft.value}
            onChange={(e) =>
              setDraft({ ...draft, value: Number(e.target.value) })
            }
            data-testid="ve-add-value"
            className="w-full h-10 rounded-md border border-border bg-background px-2 text-sm text-right"
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <label className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Effort
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={draft.effort}
            onChange={(e) =>
              setDraft({ ...draft, effort: Number(e.target.value) })
            }
            data-testid="ve-add-effort"
            className="w-full h-10 rounded-md border border-border bg-background px-2 text-sm text-right"
          />
        </div>
        <button
          type="submit"
          data-testid="ve-add-submit"
          className="md:col-span-1 h-10 rounded-md bg-foreground text-background text-sm font-medium flex items-center justify-center gap-1 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <div
        className="border border-border rounded-md p-4 bg-background"
        data-testid="ve-chart"
      >
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto max-w-[720px] mx-auto block"
            role="img"
            aria-label="Value versus effort scatter plot"
          >
            {/* Quadrant backgrounds */}
            <rect
              x={PAD}
              y={PAD}
              width={chartW / 2}
              height={chartH / 2}
              fill="hsl(var(--secondary))"
              fillOpacity="0.45"
            />
            <rect
              x={PAD + chartW / 2}
              y={PAD + chartH / 2}
              width={chartW / 2}
              height={chartH / 2}
              fill="hsl(var(--secondary))"
              fillOpacity="0.2"
            />
            {/* Axes */}
            <line
              x1={PAD}
              y1={PAD}
              x2={PAD}
              y2={H - PAD}
              stroke="currentColor"
              strokeOpacity="0.3"
            />
            <line
              x1={PAD}
              y1={H - PAD}
              x2={W - PAD}
              y2={H - PAD}
              stroke="currentColor"
              strokeOpacity="0.3"
            />
            {/* Midlines */}
            <line
              x1={PAD + chartW / 2}
              y1={PAD}
              x2={PAD + chartW / 2}
              y2={H - PAD}
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeDasharray="4 4"
            />
            <line
              x1={PAD}
              y1={PAD + chartH / 2}
              x2={W - PAD}
              y2={PAD + chartH / 2}
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeDasharray="4 4"
            />
            {/* Quadrant labels */}
            {VE_QUADRANTS.map((q) => {
              const pos = QUADRANT_POSITION[q.id];
              const x =
                pos.x === "left" ? PAD + 12 : PAD + chartW - 12;
              const y =
                pos.y === "top" ? PAD + 20 : PAD + chartH - 10;
              return (
                <text
                  key={q.id}
                  x={x}
                  y={y}
                  textAnchor={pos.x === "left" ? "start" : "end"}
                  className="fill-current"
                  fontFamily="ui-serif, Georgia, serif"
                  fontSize="14"
                  fontStyle="italic"
                  opacity="0.75"
                >
                  {q.label}
                </text>
              );
            })}
            {/* Axis titles */}
            <text
              x={W / 2}
              y={H - 8}
              textAnchor="middle"
              className="fill-current"
              fontSize="11"
              letterSpacing="2"
              opacity="0.65"
            >
              EFFORT →
            </text>
            <text
              x={14}
              y={H / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${H / 2})`}
              className="fill-current"
              fontSize="11"
              letterSpacing="2"
              opacity="0.65"
            >
              VALUE →
            </text>
            {/* Points */}
            {items.map((it) => (
              <g
                key={it.id}
                data-testid={`ve-point-${it.id}`}
                transform={`translate(${toX(it.effort || 0)}, ${toY(
                  it.value || 0,
                )})`}
              >
                <circle
                  r="7"
                  fill="hsl(var(--background))"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <circle r="3" fill="currentColor" />
                <text
                  x="10"
                  y="4"
                  className="fill-current"
                  fontSize="11"
                  fontFamily="ui-serif, Georgia, serif"
                >
                  {it.title}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VE_QUADRANTS.map((q) => (
          <div
            key={q.id}
            className="border border-border rounded-md p-4 bg-background"
            data-testid={`ve-quadrant-${q.id}`}
          >
            <h4 className="font-editorial text-lg">{q.label}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {q.description}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="ve-list-table">
            <thead className="bg-secondary/60 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-editorial font-medium">
                  Title
                </th>
                <th className="px-4 py-3 text-right font-editorial font-medium">
                  Value
                </th>
                <th className="px-4 py-3 text-right font-editorial font-medium">
                  Effort
                </th>
                <th className="px-4 py-3 text-left font-editorial font-medium">
                  Quadrant
                </th>
                <th className="px-4 py-3 text-right font-editorial font-medium">
                  V / E
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground text-sm"
                  >
                    No items yet.
                  </td>
                </tr>
              )}
              {rows.map((it) => (
                <tr
                  key={it.id}
                  data-testid={`ve-row-${it.id}`}
                  className="border-b border-border last:border-0 hover:bg-accent/40"
                >
                  <td className="px-4 py-3 align-top">
                    <input
                      value={it.title}
                      onChange={(e) =>
                        onUpdateItem(it.id, { title: e.target.value })
                      }
                      data-testid={`ve-row-title-${it.id}`}
                      className="w-full bg-transparent font-editorial leading-snug focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 -mx-1"
                    />
                    <input
                      value={it.description || ""}
                      placeholder="Add a note…"
                      onChange={(e) =>
                        onUpdateItem(it.id, { description: e.target.value })
                      }
                      data-testid={`ve-row-description-${it.id}`}
                      className="mt-1 w-full bg-transparent text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 -mx-1"
                    />
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={it.value}
                      onChange={(e) =>
                        onUpdateItem(it.id, { value: Number(e.target.value) })
                      }
                      data-testid={`ve-row-value-${it.id}`}
                      className="w-16 h-8 text-right rounded border border-transparent hover:border-border focus:border-ring focus:outline-none bg-transparent px-2"
                    />
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={it.effort}
                      onChange={(e) =>
                        onUpdateItem(it.id, { effort: Number(e.target.value) })
                      }
                      data-testid={`ve-row-effort-${it.id}`}
                      className="w-16 h-8 text-right rounded border border-transparent hover:border-border focus:border-ring focus:outline-none bg-transparent px-2"
                    />
                  </td>
                  <td className="px-4 py-3 align-top text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {VE_QUADRANTS.find((q) => q.id === it.quadrant)?.label}
                  </td>
                  <td className="px-4 py-3 text-right font-editorial text-lg tabular-nums align-top">
                    {it.score.toFixed(2)}
                  </td>
                  <td className="px-2 py-3 align-top">
                    <button
                      type="button"
                      title="Delete item"
                      data-testid={`ve-row-delete-${it.id}`}
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
    </div>
  );
};

export default ValueEffortChart;
