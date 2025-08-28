import { useState } from "react";
import { useAppSelector, useAppDispatch } from "./hooks";
import {
  selectFilteredRecipes,
  deleteRecipe,
  toggleFavorite,
} from "./features/recipes/recipesSlice";
import FilterBar from "./components/FilterBar";
import RecipeCard from "./components/RecipeCard";
import RecipeFormModal from "./components/RecipeFormModal";

export default function App() {
  const recipes = useAppSelector(selectFilteredRecipes);
  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = useState<
    { mode: "create" } | { mode: "edit"; id: string } | null
  >(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">🍳 Recipe Book</h1>
          <button
            onClick={() => setOpenModal({ mode: "create" })}
            className="rounded-2xl px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition shadow"
          >
            + Add Recipe
          </button>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <FilterBar />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {recipes.length === 0 ? (
          <p className="text-slate-400 text-center py-24">
            No recipes yet. Add your first one!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onEdit={() => setOpenModal({ mode: "edit", id: r.id })}
                onDelete={() => {
                  if (confirm(`Delete "${r.name}"?`)) {
                    dispatch(deleteRecipe(r.id));
                  }
                }}
                onToggleFavorite={() => dispatch(toggleFavorite(r.id))}
              />
            ))}
          </div>
        )}
      </main>

      {openModal && (
        <RecipeFormModal
          mode={openModal.mode}
          id={openModal.mode === "edit" ? openModal.id : undefined}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}
