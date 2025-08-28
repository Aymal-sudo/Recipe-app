import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "./features/recipes/recipesSlice";

type PreloadedState = {
  recipes: ReturnType<typeof recipesReducer>;
};

function loadState(): PreloadedState | undefined {
  try {
    const raw = localStorage.getItem("recipebook_state_v1");
    if (!raw) return undefined; // let RTK use initialState
    const parsed = JSON.parse(raw);
    if (parsed && parsed.recipes) {
      return { recipes: parsed.recipes };
    }
    return undefined;
  } catch {
    return undefined;
  }
}

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    recipes: recipesReducer, // ✅ this is fine
  },
  ...(preloadedState ? { preloadedState } : {}),
  // Redux DevTools is enabled by default in dev
});

store.subscribe(() => {
  try {
    const state = store.getState();
    // Persist just the slice; compact and explicit
    localStorage.setItem(
      "recipebook_state_v1",
      JSON.stringify({ recipes: state.recipes })
    );
  } catch {
    // ignore write errors (e.g., private mode)
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
