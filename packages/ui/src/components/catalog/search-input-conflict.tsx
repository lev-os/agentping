import * as React from "react";
import { SearchInput } from "../ui/search-input";

export interface SearchInputConflictProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange"
  > {
  query?: string;
  defaultQuery?: string;
  loading?: boolean;
  onQueryChange?: (query: string) => void;
  containerClassName?: string;
}

function useQuery(
  query: string | undefined,
  defaultQuery: string | undefined,
  onQueryChange: ((next: string) => void) | undefined
) {
  const [internalQuery, setInternalQuery] = React.useState(defaultQuery || "");
  const resolvedQuery = query ?? internalQuery;

  const setQuery = React.useCallback(
    (next: string) => {
      if (query === undefined) {
        setInternalQuery(next);
      }
      onQueryChange?.(next);
    },
    [onQueryChange, query]
  );

  return { resolvedQuery, setQuery };
}

export function SearchInputStudioRaw({
  query,
  defaultQuery,
  loading = false,
  onQueryChange,
  className,
  containerClassName,
  placeholder = "Search logs...",
  disabled,
  ...props
}: SearchInputConflictProps) {
  const { resolvedQuery, setQuery } = useQuery(query, defaultQuery, onQueryChange);

  return (
    <div className={["relative w-full", containerClassName].filter(Boolean).join(" ")}>
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">
        {loading ? "…" : "⌕"}
      </span>
      <input
        value={resolvedQuery}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        disabled={disabled || loading}
        className={[
          "h-9 w-full border border-slate-600 bg-slate-950 pl-8 pr-8 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {resolvedQuery ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-1.5 top-1/2 h-6 -translate-y-1/2 px-1.5 text-xs text-slate-400 hover:bg-slate-800"
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export function SearchInputWebUiRaw({
  query,
  defaultQuery,
  loading = false,
  onQueryChange,
  className,
  containerClassName,
  placeholder = "Search...",
  disabled,
  ...props
}: SearchInputConflictProps) {
  const { resolvedQuery, setQuery } = useQuery(query, defaultQuery, onQueryChange);

  return (
    <div className={["relative w-full", containerClassName].filter(Boolean).join(" ")}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
        {loading ? "…" : "⌕"}
      </span>
      <input
        value={resolvedQuery}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        disabled={disabled || loading}
        className={[
          "h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 pl-8 pr-8 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {resolvedQuery ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-1.5 top-1/2 h-6 rounded px-1.5 -translate-y-1/2 text-xs text-zinc-400 hover:bg-zinc-800"
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export function SearchInputCandidate({
  query,
  defaultQuery,
  loading = false,
  onQueryChange,
  className,
  containerClassName,
  placeholder = "Search...",
  disabled,
  ...props
}: SearchInputConflictProps) {
  const { resolvedQuery, setQuery } = useQuery(query, defaultQuery, onQueryChange);

  return (
    <SearchInput
      value={resolvedQuery}
      onChange={setQuery}
      isLoading={loading}
      className={className}
      containerClassName={containerClassName}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  );
}
