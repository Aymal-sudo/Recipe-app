import { useEffect, useMemo, useState } from "react";
import {
  addRecipe,
  updateRecipe,
  recipesSelectors,
  type Category,
} from "../features/recipes/recipesSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

const categories: Category[] = [
  "Main Course",
  "Dessert",
  "Snack",
  "Breakfast",
  "Drink",
  "Other",
];

export default function RecipeFormModal({
  mode,
  id,
  onClose,
}: {
  mode: "create" | "edit";
  id?: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const existing = useAppSelector((s) =>
    id ? recipesSelectors.selectById(s, id) : undefined
  );

  // Initialize form state
  const [name, setName] = useState(existing?.name ?? "");
  const [ingredientsText, setIngredientsText] = useState(
    existing ? existing.ingredients.join("\n") : ""
  );
  const [instructions, setInstructions] = useState(
    existing?.instructions ?? ""
  );
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? "");
  const [category, setCategory] = useState<Category>(
    existing?.category ?? "Main Course"
  );

  // Sync when `existing` arrives (edit mode opening)
  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setIngredientsText(existing.ingredients.join("\n"));
    setInstructions(existing.instructions);
    setImageUrl(existing.imageUrl ?? "");
    setCategory(existing.category);
  }, [existing]);

  const ingredientsArray = useMemo(
    () =>
      ingredientsText
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
    [ingredientsText]
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required");
    if (ingredientsArray.length === 0)
      return alert("At least one ingredient is required");
    if (!instructions.trim()) return alert("Instructions are required");

    if (mode === "create") {
      dispatch(
        addRecipe({
          name: name.trim(),
          ingredients: ingredientsArray,
          instructions: instructions.trim(),
          imageUrl: imageUrl.trim() || undefined,
          category,
        })
      );
    } else if (mode === "edit" && id) {
      dispatch(
        updateRecipe({
          id,
          changes: {
            name: name.trim(),
            ingredients: ingredientsArray,
            instructions: instructions.trim(),
            imageUrl: imageUrl.trim() || undefined,
            category,
          },
        })
      );
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <form
        onSubmit={submit}
        className="relative z-30 w-[min(720px,92vw)] max-h-[88vh] overflow-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Add Recipe" : "Edit Recipe"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1 border border-slate-700 hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-slate-300">Name *</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-slate-300">Category *</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm text-slate-300">
              Ingredients * (one per line or comma-separated)
            </span>
            <textarea
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              rows={4}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-300">Instructions *</span>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={6}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-300">Image URL (optional)</span>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2"
              placeholder="https://…"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="rounded-2xl px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition shadow"
          >
            {mode === "create" ? "Create" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
