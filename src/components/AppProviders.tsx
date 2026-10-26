import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, STORAGE_KEY, type AppStore } from "@/store/store";
import { hydrateCart } from "@/store/cartSlice";
import { hydrateCatalog } from "@/store/catalogSlice";
import type { Product } from "@/data/products";

interface UIState {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  activeProduct: Product | null;
  openProduct: (p: Product | null) => void;
}
const UICtx = createContext<UIState | null>(null);
export const useUI = () => {
  const c = useContext(UICtx);
  if (!c) throw new Error("useUI outside provider");
  return c;
};

export function AppProviders({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();
  const store = storeRef.current;

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeProduct, openProduct] = useState<Product | null>(null);
  // Keep the storefront in its intended warm, light theme regardless of system settings.
  useEffect(() => {
    document.documentElement.dataset["theme"] = "light";
    document.documentElement.style.colorScheme = "light";
    localStorage.setItem("amarel-theme", "light");
  }, []);

  // Local persistence (browser only, after hydration).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.cart?.items) store.dispatch(hydrateCart(saved.cart.items));
        if (saved.catalog?.products) store.dispatch(hydrateCatalog(saved.catalog));
      }
    } catch {
      /* ignore corrupt storage */
    }
    return store.subscribe(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()));
    });
  }, [store]);

  return (
    <Provider store={store}>
      <UICtx.Provider value={{ cartOpen, setCartOpen, searchOpen, setSearchOpen, activeProduct, openProduct }}>
        {children}
      </UICtx.Provider>
    </Provider>
  );
}
