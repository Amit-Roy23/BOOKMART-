"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Seller } from "@/types/nearby";
import { useNearbyMap } from "@/hooks/useNearbyMap";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const currentMarkerIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23008080'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
  className: "current-location-marker",
});

const sellerMarkerIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23008080'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "seller-marker",
});

function MapController({ sellerId }: { sellerId: string | null }) {
  const map = useMap();
  const sellersRef = useRef<Seller[]>([]);

  useEffect(() => {
    if (sellerId) {
      const seller = sellersRef.current.find((s) => s.id === sellerId);
      if (seller) {
        map.flyTo([seller.latitude, seller.longitude], 14, { duration: 1.5 });
      }
    }
  }, [sellerId, map]);

  return null;
}

export default function NearbyMap({ sellers }: { sellers: Seller[] }) {
  const { selectedSellerId, setSelectedSellerId, userLocation } = useNearbyMap();
  const mapRef = useRef<L.Map>(null);

  return (
    <div className="rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <MapContainer
        center={[userLocation?.lat || 22.5726, userLocation?.lng || 88.3639]}
        zoom={13}
        className="h-[620px] w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController sellerId={selectedSellerId} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={currentMarkerIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {sellers.map((seller) => (
          <Marker
            key={seller.id}
            position={[seller.latitude, seller.longitude]}
            icon={sellerMarkerIcon}
            eventHandlers={{
              click: () => setSelectedSellerId(seller.id),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
