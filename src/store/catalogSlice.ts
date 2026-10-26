import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialProducts, type Product } from "@/data/products";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";
export interface Order {
  id: string;
  customer: string;
  total: number;
  items: number;
  status: OrderStatus;
  date: string;
}

export interface CatalogState {
  products: Product[];
  favorites: string[];
  orders: Order[];
}

const initialOrders: Order[] = [
  { id: "FZ-1042", customer: "Amara Okafor", total: 285000, items: 2, status: "Processing", date: "2026-10-21" },
  { id: "FZ-1041", customer: "Léa Martin", total: 46000, items: 1, status: "Shipped", date: "2026-10-20" },
  { id: "FZ-1040", customer: "Tunde Bello", total: 31000, items: 3, status: "Delivered", date: "2026-10-18" },
  { id: "FZ-1039", customer: "Sofia Rossi", total: 98000, items: 1, status: "Pending", date: "2026-10-17" },
];

const initialState: CatalogState = { products: initialProducts, favorites: [], orders: initialOrders };

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    toggleFavorite(state, a: PayloadAction<string>) {
      state.favorites = state.favorites.includes(a.payload)
        ? state.favorites.filter((f) => f !== a.payload)
        : [...state.favorites, a.payload];
    },
    addProduct(state, a: PayloadAction<Product>) {
      state.products.unshift(a.payload);
    },
    updateProduct(state, a: PayloadAction<Product>) {
      const i = state.products.findIndex((p) => p.id === a.payload.id);
      if (i >= 0) state.products[i] = a.payload;
    },
    deleteProduct(state, a: PayloadAction<string>) {
      state.products = state.products.filter((p) => p.id !== a.payload);
      state.favorites = state.favorites.filter((f) => f !== a.payload);
    },
    setStock(state, a: PayloadAction<{ id: string; stock: number }>) {
      const p = state.products.find((x) => x.id === a.payload.id);
      if (p) p.stock = Math.max(0, Math.floor(a.payload.stock));
    },
    setOrderStatus(state, a: PayloadAction<{ id: string; status: OrderStatus }>) {
      const o = state.orders.find((x) => x.id === a.payload.id);
      if (o) o.status = a.payload.status;
    },
    placeDemoOrder(state, a: PayloadAction<{ total: number; items: number }>) {
      const n = 1043 + state.orders.length - 4;
      state.orders.unshift({
        id: `FZ-${n}`, customer: "Demo customer", total: a.payload.total, items: a.payload.items,
        status: "Pending", date: new Date().toISOString().slice(0, 10),
      });
    },
    resetCatalog() {
      return initialState;
    },
    hydrateCatalog(_s, a: PayloadAction<CatalogState>) {
      return a.payload;
    },
  },
});

export const {
  toggleFavorite, addProduct, updateProduct, deleteProduct, setStock, setOrderStatus,
  placeDemoOrder, resetCatalog, hydrateCatalog,
} = catalogSlice.actions;
export default catalogSlice.reducer;
