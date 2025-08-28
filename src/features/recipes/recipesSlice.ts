import {
  createSlice,
  createEntityAdapter,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export type Category =
  | "Main Course"
  | "Dessert"
  | "Snack"
  | "Breakfast"
  | "Drink"
  | "Other";

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  category: Category;
  favorite: boolean;
  createdAt: string; // ISO string
}

export interface RecipeInput {
  name: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  category: Category;
}

const recipesAdapter = createEntityAdapter<Recipe>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialFilters = {
  search: "",
  category: "All" as Category | "All",
  favoritesOnly: false,
};

const slice = createSlice({
  name: "recipes",
  initialState: recipesAdapter.getInitialState({ filters: initialFilters }),
  reducers: {
    addRecipe: {
      reducer: (state, action: PayloadAction<Recipe>) => {
        recipesAdapter.addOne(state, action.payload);
      },
      prepare: (input: RecipeInput) => ({
        payload: {
          id: nanoid(),
          ...input,
          favorite: false,
          createdAt: new Date().toISOString(),
        } as Recipe,
      }),
    },
    updateRecipe: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<Recipe, "id" | "createdAt">>;
      }>
    ) => {
      const { id, changes } = action.payload;
      recipesAdapter.updateOne(state, { id, changes });
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      recipesAdapter.removeOne(state, action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const r = state.entities[id];
      if (r) r.favorite = !r.favorite;
    },

    // filters
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<Category | "All">) => {
      state.filters.category = action.payload;
    },
    setFavoritesOnly: (state, action: PayloadAction<boolean>) => {
      state.filters.favoritesOnly = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
  },
});

export const {
  addRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
  setSearch,
  setCategory,
  setFavoritesOnly,
  resetFilters,
} = slice.actions;

export default slice.reducer;

// Base selectors from the adapter
export const recipesSelectors = recipesAdapter.getSelectors<RootState>(
  (s) => s.recipes
);

// Filters selector
export const selectFilters = (s: RootState) => s.recipes.filters;

// Derived selector = memoized filter/search pipeline
export const selectFilteredRecipes = createSelector(
  [recipesSelectors.selectAll, selectFilters],
  (recipes, filters) => {
    const q = filters.search.trim().toLowerCase();
    return recipes.filter((r) => {
      if (filters.favoritesOnly && !r.favorite) return false;
      if (filters.category !== "All" && r.category !== filters.category)
        return false;
      if (!q) return true;
      const haystack = [r.name, r.instructions, ...r.ingredients]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }
);

export const allCategories: (Category | "All")[] = [
  "All",
  "Main Course",
  "Dessert",
  "Snack",
  "Breakfast",
  "Drink",
  "Other",
];
