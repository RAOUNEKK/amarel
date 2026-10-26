import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CATEGORIES, formatPrice, imageLibrary, type Category, type Product } from "@/data/products";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addProduct, deleteProduct, resetCatalog, setOrderStatus, setStock, updateProduct, type OrderStatus } from "@/store/catalogSlice";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner dashboard (demo) — AMARÉL" },
      { name: "description", content: "Frontend-only demo of AMARÉL product, stock and order management." },
      { property: "og:title", content: "Owner dashboard (demo) — AMARÉL" },
      { property: "og:description", content: "Frontend-only demo of AMARÉL product, stock and order management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered"];
const images = Object.entries(imageLibrary);

function Admin() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.catalog.products);
  const orders = useAppSelector((s) => s.catalog.orders);
  const [editing, setEditing] = useState<Product | null>(null);
  const [tab, setTab] = useState<"products" | "orders">("products");

  const revenue = orders.reduce((n, o) => n + o.total, 0);
  const stats = [
    ["Products", products.length],
    ["Out of stock", products.filter((p) => p.stock <= 0).length],
    ["Orders", orders.length],
    ["Revenue (demo)", formatPrice(revenue)],
  ];

  const blank = (): Product => ({ id: `p-${Date.now()}`, name: "", category: "Furniture", price: 0, description: "", image: imageLibrary.furniture, stock: 1, createdAt: Date.now(), badge: "New" });

  return (
    <div className="mx-auto max-w-[1500px] px-5 pt-14 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Owner dashboard · demo</p>
          <h1 className="mt-3 text-5xl text-foreground">Manage the <span className="font-medium">store</span></h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">Changes are saved in this browser only. A real store would need accounts and a database.</p>
        </div>
        <button onClick={() => { dispatch(resetCatalog()); toast("Demo data restored"); }} className="btn-ghost-glow"><RotateCcw size={16} /> Reset demo</button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="card-glow rounded-2xl p-6">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{l}</p>
            <p className="mt-2 font-display text-4xl font-light">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-2">
        {(["products", "orders"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full border px-5 py-2 text-sm capitalize transition ${tab === t ? "border-foreground bg-foreground text-background" : "border-input text-foreground/80"}`}>{t}</button>
        ))}
        {tab === "products" && <button onClick={() => setEditing(blank())} className="btn-glow ml-auto !py-2"><Plus size={16} /> Add product</button>}
      </div>

      <div className="card-glow mt-6 overflow-x-auto rounded-2xl !transform-none">
        {tab === "products" ? (
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs tracking-widest text-muted-foreground uppercase">
              <tr className="border-b border-border"><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="flex items-center gap-3 p-4"><img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" /><span className="font-display text-lg text-foreground">{p.name}</span></td>
                  <td className="text-muted-foreground">{p.category}</td>
                  <td className="text-primary">{formatPrice(p.price)}</td>
                  <td>
                    <input type="number" min={0} value={p.stock} aria-label={`Stock for ${p.name}`} onChange={(e) => dispatch(setStock({ id: p.id, stock: Number(e.target.value) }))} className="input-glow !w-20 !rounded-lg !px-3 !py-1.5" />
                    {p.stock <= 0 && <span className="ml-2 text-xs text-destructive">Unavailable</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} className="p-2 hover:text-primary"><Pencil size={16} /></button>
                    <button onClick={() => { if (confirm(`Delete ${p.name}?`)) { dispatch(deleteProduct(p.id)); toast("Product deleted"); } }} aria-label={`Delete ${p.name}`} className="p-2 hover:text-destructive"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs tracking-widest text-muted-foreground uppercase">
              <tr className="border-b border-border"><th className="p-4">Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className="p-4 font-medium text-foreground">{o.id}</td><td>{o.customer}</td><td className="text-muted-foreground">{o.date}</td><td>{o.items}</td><td className="text-primary">{formatPrice(o.total)}</td>
                  <td className="p-4">
                    <select value={o.status} aria-label={`Status for ${o.id}`} onChange={(e) => dispatch(setOrderStatus({ id: o.id, status: e.target.value as OrderStatus }))} className="input-glow !w-36 !rounded-lg !py-1.5">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ProductForm product={editing} isNew={!!editing && !products.some((p) => p.id === editing.id)} onClose={() => setEditing(null)} onSave={(p, isNew) => {
        dispatch(isNew ? addProduct(p) : updateProduct(p));
        toast.success(isNew ? "Product added" : "Product updated");
        setEditing(null);
      }} />
    </div>
  );
}

function ProductForm({ product, isNew, onClose, onSave }: { product: Product | null; isNew: boolean; onClose: () => void; onSave: (p: Product, isNew: boolean) => void }) {
  const [draft, setDraft] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const p = draft && product && draft.id === product.id ? draft : product;
  if (product && (!draft || draft.id !== product.id)) queueMicrotask(() => setDraft(product));
  const set = (patch: Partial<Product>) => p && setDraft({ ...p, ...patch });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p) return;
    if (!p.name.trim()) return setError("Name is required.");
    if (!(p.price > 0)) return setError("Price must be greater than 0.");
    setError("");
    onSave({ ...p, name: p.name.trim() }, isNew);
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-3xl border-border bg-background">
        <DialogTitle className="font-display text-3xl font-medium text-foreground">{isNew ? "Add product" : "Edit product"}</DialogTitle>
        <DialogDescription className="text-muted-foreground">Saved in this browser only.</DialogDescription>
        {p && (
          <form onSubmit={save} className="space-y-4">
            <input value={p.name} onChange={(e) => set({ name: e.target.value })} placeholder="Name" aria-label="Name" className="input-glow" />
            <div className="grid grid-cols-3 gap-3">
              <select value={p.category} onChange={(e) => set({ category: e.target.value as Category })} aria-label="Category" className="input-glow">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" min={0} value={p.price} onChange={(e) => set({ price: Number(e.target.value) })} aria-label="Price (DA)" placeholder="Price (DA)" className="input-glow" />
              <input type="number" min={0} value={p.stock} onChange={(e) => set({ stock: Number(e.target.value) })} aria-label="Stock" placeholder="Stock" className="input-glow" />
            </div>
            <textarea rows={3} value={p.description} onChange={(e) => set({ description: e.target.value })} placeholder="Description" aria-label="Description" className="input-glow !rounded-2xl" />
            <div className="grid grid-cols-7 gap-2" role="radiogroup" aria-label="Image">
              {images.map(([k, src]) => (
                <button type="button" key={k} onClick={() => set({ image: src })} aria-label={k} aria-checked={p.image === src} role="radio"
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${p.image === src ? "border-primary" : "border-transparent"}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button className="btn-glow w-full justify-center">Save</button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
