"use client";

import { MessageCircle, MapPin } from "lucide-react";
import { Seller } from "@/types/nearby";
import Image from "next/image";

interface SellerInformationPanelProps {
  seller: Seller | null;
}

export default function SellerInformationPanel({ seller }: SellerInformationPanelProps) {
  if (!seller) {
    return (
      <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="text-center py-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">Select a seller</h3>
          <p className="mt-2 text-sm text-slate-500">Click on a map marker to view seller details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-4 mb-4">
        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-slate-100 shrink-0 relative">
          <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="64px" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-900">{seller.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{seller.college}</p>
          <p className="text-xs text-slate-400 mt-0.5">{seller.distance} away</p>
        </div>
        <a
          href={`https://wa.me/${seller.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white transition-all duration-200 hover:scale-110 hover:shadow-lg shrink-0"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={20} />
        </a>
      </div>

      <div className="border-t border-slate-100 my-4" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-xs text-slate-500">Starting from</p>
              <p className="text-lg font-extrabold text-primary">₹180</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <div>
            <p className="text-xs text-slate-500">Condition</p>
            <p className="text-sm font-bold text-slate-900">Like New</p>
          </div>
        </div>
      </div>
    </div>
  );
}
