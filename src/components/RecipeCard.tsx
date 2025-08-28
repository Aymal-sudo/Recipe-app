import type { Recipe } from "../features/recipes/recipesSlice";
import { useState } from "react";

export default function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm overflow-hidden">
      <div className="h-40 w-full bg-slate-800">
        {recipe.imageUrl && imgOk ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="h-full w-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
            <p className="text-xs text-slate-400">{recipe.category}</p>
          </div>
          <button
            onClick={onToggleFavorite}
            title="Toggle favorite"
            className={`rounded-full px-3 py-1 border ${
              recipe.favorite
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            ★
          </button>
        </div>

        <p className="text-sm text-slate-300 line-clamp-3">
          {recipe.instructions}
        </p>

        <div className="text-xs text-slate-400">
          Ingredients: {recipe.ingredients.slice(0, 4).join(", ")}
          {recipe.ingredients.length > 4 ? "…" : ""}
        </div>

        <div className="mt-2 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 rounded-xl px-3 py-2 bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 rounded-xl px-3 py-2 border border-red-700 text-red-300 hover:bg-red-900/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
