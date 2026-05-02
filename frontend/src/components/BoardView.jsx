import { FRAMEWORKS, FRAMEWORK_META } from "../lib/frameworks";
import RiceTable from "./RiceTable";
import KanoBoard from "./KanoBoard";
import ValueEffortChart from "./ValueEffortChart";

export const BoardView = ({ board, onAddItem, onUpdateItem, onDeleteItem }) => {
  if (!board) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No board selected.
      </div>
    );
  }

  const meta = FRAMEWORK_META[board.framework];

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 md:py-14 animate-fade-in">
      <header className="mb-10 rule-top pt-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {meta?.label} framework
        </div>
        <h1
          className="mt-2 font-editorial text-4xl sm:text-5xl tracking-tight leading-tight"
          data-testid="board-title"
        >
          {board.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          {meta?.blurb}
        </p>
      </header>

      {board.framework === FRAMEWORKS.RICE && (
        <RiceTable
          items={board.items}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
        />
      )}
      {board.framework === FRAMEWORKS.KANO && (
        <KanoBoard
          items={board.items}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
        />
      )}
      {board.framework === FRAMEWORKS.VALUE_EFFORT && (
        <ValueEffortChart
          items={board.items}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
        />
      )}
    </div>
  );
};

export default BoardView;
