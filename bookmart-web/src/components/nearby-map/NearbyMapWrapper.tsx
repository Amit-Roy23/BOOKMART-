"use client";

import dynamic from "next/dynamic";

const NearbyMap = dynamic(() => import("./NearbyMap"), {
  ssr: false,
  loading: () => <div className="h-[620px] w-full rounded-[20px] bg-slate-200 animate-pulse" />,
});

export default function NearbyMapWrapper({ sellers }: { sellers: { id: string; name: string; avatar: string; college: string; latitude: number; longitude: number; phone: string; whatsapp: string; distance: string; rating: number; verified: boolean; }[] }) {
  return <NearbyMap sellers={sellers} />;
}
