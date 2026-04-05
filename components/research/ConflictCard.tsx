import type { Conflict } from "@/lib/types";

interface ConflictCardProps {
  conflicts: Conflict[];
}

export function ConflictCard({ conflicts }: ConflictCardProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-400/40 bg-amber-50/50 p-4 dark:bg-amber-950/20">
      <h3 className="mb-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
        Conflicting claims detected ({conflicts.length})
      </h3>
      <div className="flex flex-col gap-3">
        {conflicts.map((c, i) => (
          <div key={i} className="text-sm">
            <p className="mb-1 font-medium text-amber-800 dark:text-amber-300">
              {c.topic}
            </p>
            <div className="ml-2 flex flex-col gap-1 text-foreground/70">
              <p>
                <span className="font-medium">A:</span> {c.claimA}{" "}
                <span className="text-xs text-muted-foreground">({c.sourceA})</span>
              </p>
              <p>
                <span className="font-medium">B:</span> {c.claimB}{" "}
                <span className="text-xs text-muted-foreground">({c.sourceB})</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
