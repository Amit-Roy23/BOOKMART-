"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Shield,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export interface PurchaseCardBook {
  price: number;
  originalPrice: number;
  discount: number;
  condition: string;
  seller: {
    name: string;
    verified?: boolean;
    distance?: string;
  };
  distance?: string;
  rating?: number;
  reviewCount?: number;
  stock: number;
  available?: boolean;
}

interface PurchaseCardProps {
  book: PurchaseCardBook;
}

export default function PurchaseCard({ book }: PurchaseCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  function increment() {
    setQuantity((q) => Math.min(q + 1, book.stock));
  }

  function decrement() {
    setQuantity((q) => Math.max(q - 1, 1));
  }

  async function handleAddToCart() {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAdding(false);
  }

  return (
    <div className="sticky top-24 space-y-5">
      <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Price */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Price</p>
          <div className="flex items-end gap-3">
            <span className="text-[32px] font-extrabold text-primary tracking-tight leading-none">
              {formatPrice(book.price)}
            </span>
            <span className="text-sm text-slate-400 line-through font-medium pb-1">
              {formatPrice(book.originalPrice)}
            </span>
            <span className="rounded-full bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 mb-1">
              {book.discount}% OFF
            </span>
          </div>
        </div>

        {/* Condition */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Condition</p>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 text-primary text-[11px] font-bold px-3 py-1">
              {book.condition}
            </span>
            <span className="text-xs text-slate-500">Almost no signs of wear</span>
          </div>
        </div>

        {/* Seller */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Seller</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
              {book.seller.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 truncate">{book.seller.name}</p>
                {book.seller.verified && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                    Top Rated
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span>★ {book.rating ?? 4.5} ({book.reviewCount ?? 0})</span>
                <span>📍 {book.distance || book.seller.distance || "Nearby"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity</p>
          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-bold text-slate-900">{quantity}</span>
            <button
              onClick={increment}
              disabled={quantity >= book.stock}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
            <span className="text-[11px] text-slate-400">{book.stock} left</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !book.available}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-primary py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 shadow-[0_2px_8px_rgba(0,128,128,0.25)]"
          >
            {isAdding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to cart
              </>
            )}
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-[12px] border-2 border-primary py-3.5 text-sm font-bold text-primary transition-all duration-200 hover:bg-primary/5 active:scale-[0.98]">
            Buy now
          </button>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Shield size={14} className="text-primary" />
          Secure transaction
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <RefreshCw size={14} className="text-primary" />
          7-day return policy
        </span>
      </div>
    </div>
  );
}
