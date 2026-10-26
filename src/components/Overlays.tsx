import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUI } from "./AppProviders";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addToCart, clearCart, decreaseQuantity, increaseQuantity, removeFromCart, selectCartCount, selectCartSubtotal } from "@/store/cartSlice";
import { placeDemoOrder } from "@/store/catalogSlice";
import { formatPrice } from "@/data/products";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const items = useAppSelector((s) => s.cart.items);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const dispatch = useAppDispatch();

  const checkout = () => {
    dispatch(placeDemoOrder({ total: subtotal, items: count }));
    dispatch(clearCart());
    setCartOpen(false);
    toast("Demo checkout complete", { description: "No payment was taken — this is a demonstration store." });
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col border-l border-border bg-background p-0 sm:max-w-md">
        <div className="border-b border-border p-6">
          <SheetTitle className="font-display text-3xl font-medium text-foreground">Your cart</SheetTitle>
          <SheetDescription className="text-muted-foreground">{count} {count === 1 ? "item" : "items"}</SheetDescription>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {items.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-display text-2xl text-foreground">Your cart is quiet.</p>
              <p className="mt-2 text-sm text-muted-foreground">Add a piece you love to begin.</p>
              <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-ghost-glow mt-6">Browse the shop</Link>
            </div>
          )}
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 rounded-2xl border border-border bg-card p-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <img src={i.image} alt="" className="h-20 w-20 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-display text-lg text-foreground">{i.name}</p>
                  <button onClick={() => dispatch(removeFromCart(i.id))} aria-label={`Remove ${i.name}`} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </div>
                <p className="text-sm text-primary">{formatPrice(i.price)}</p>
                <div className="mt-2 inline-flex items-center rounded-full border border-border">
                  <button onClick={() => dispatch(decreaseQuantity(i.id))} aria-label="Decrease quantity" className="p-1.5 hover:text-primary"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm" aria-live="polite">{i.quantity}</span>
                  <button onClick={() => dispatch(increaseQuantity(i.id))} aria-label="Increase quantity" className="p-1.5 hover:text-primary"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="space-y-4 border-t border-border p-6">
            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <button onClick={checkout} className="btn-glow w-full justify-center">Checkout (demo)</button>
            <button onClick={() => dispatch(clearCart())} className="w-full text-sm text-muted-foreground hover:text-primary">Clear cart</button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function ProductModal() {
  const { activeProduct: p, openProduct, setCartOpen } = useUI();
  const dispatch = useAppDispatch();
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && openProduct(null)}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border-border bg-background p-0">
        {p && (
          <div className="grid md:grid-cols-2">
            <img src={p.image} alt={p.name} className="aspect-[4/5] h-full w-full object-cover" />
            <div className="flex flex-col p-8">
              <p className="eyebrow">{p.category}</p>
              <DialogTitle className="mt-3 font-display text-4xl font-medium text-foreground">{p.name}</DialogTitle>
              <p className="mt-3 text-2xl text-primary">{formatPrice(p.price)}</p>
              <DialogDescription className="mt-5 leading-relaxed text-muted-foreground">{p.description}</DialogDescription>
              <p className="mt-4 text-sm text-muted-foreground">{p.stock > 0 ? `${p.stock} in stock` : "Currently unavailable"}</p>
              <button
                disabled={p.stock <= 0}
                onClick={() => { dispatch(addToCart(p)); openProduct(null); setCartOpen(true); }}
                className="btn-glow mt-auto justify-center"
              >
                Add to cart
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useUI();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/shop", search: { q, category: undefined } });
    setQ("");
  };
  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="rounded-3xl border-border bg-background">
        <DialogTitle className="font-display text-3xl font-medium text-foreground">Search the collection</DialogTitle>
        <DialogDescription className="sr-only">Search products by name</DialogDescription>
        <form onSubmit={submit} className="relative mt-2">
          <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" size={18} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sofa, lamp, throw…" className="input-glow !pl-11" />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { X };
