import { useAppDispatch, useAppSelector } from "../hooks";
import {
  allCategories,
  selectFilters,
  setCategory,
  setFavoritesOnly,
  setSearch,
  resetFilters,
} from "../features/recipes/recipesSlice";

export default function FilterBar() {
  const filters = useAppSelector(selectFilters);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 flex gap-3">
        <input
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          placeholder="Search by name or ingredient…"
          className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-2 outline-none focus:ring focus:ring-indigo-600/30"
        />
        <select
          value={filters.category}
          onChange={(e) => dispatch(setCategory(e.target.value as any))}
          className="rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2"
        >
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.favoritesOnly}
            onChange={(e) => dispatch(setFavoritesOnly(e.target.checked))}
          />
          <span className="text-sm text-slate-300">Favorites only</span>
        </label>
        <button
          onClick={() => dispatch(resetFilters())}
          className="rounded-2xl px-3 py-2 border border-slate-700 hover:bg-slate-900"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
