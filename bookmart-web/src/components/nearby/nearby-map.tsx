'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { formatPrice, listingCover } from '@/lib/utils';
import type { Listing } from '@/types/api';

function priceIcon(price: string, boosted: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="transform:translate(-50%,-100%);display:inline-block;white-space:nowrap;padding:4px 8px;border-radius:999px;font:700 12px var(--font-manrope),sans-serif;color:#fff;background:${boosted ? '#d97706' : '#008080'};box-shadow:0 2px 6px rgba(0,0,0,.25)">${formatPrice(price)}</div>`,
    iconSize: [0, 0],
  });
}

const centerIcon = L.divIcon({
  className: '',
  html: '<div style="transform:translate(-50%,-50%);width:16px;height:16px;border-radius:999px;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb55"></div>',
  iconSize: [0, 0],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function ClickToMove({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onMove(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

export default function NearbyMap({
  center,
  radiusKm,
  listings,
  onCenterChange,
}: {
  center: { lat: number; lng: number };
  radiusKm: number;
  listings: Listing[];
  onCenterChange: (lat: number, lng: number) => void;
}) {
  const located = listings.filter((l) => l.latitude && l.longitude);
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
      style={{ minHeight: 420 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={center.lat} lng={center.lng} />
      <ClickToMove onMove={onCenterChange} />
      <Circle
        center={[center.lat, center.lng]}
        radius={radiusKm * 1000}
        pathOptions={{ color: '#008080', fillColor: '#008080', fillOpacity: 0.06, weight: 1 }}
      />
      <Marker position={[center.lat, center.lng]} icon={centerIcon} />
      {located.map((listing) => (
        <Marker
          key={listing.id}
          position={[parseFloat(listing.latitude!), parseFloat(listing.longitude!)]}
          icon={priceIcon(listing.price, listing.is_boosted)}
        >
          <Popup>
            <a
              href={`/listings/${listing.id}`}
              style={{
                display: 'flex',
                gap: 10,
                width: 220,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- inside a Leaflet popup */}
              <img
                src={listingCover(listing)}
                alt=""
                style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 6 }}
              />
              <span>
                <strong style={{ display: 'block', fontSize: 13 }}>{listing.book.title}</strong>
                <span style={{ display: 'block', color: '#64748b', fontSize: 12 }}>
                  {listing.seller.full_name}
                  {listing.distance_km != null ? ` · ${listing.distance_km.toFixed(1)} km` : ''}
                </span>
                <span style={{ display: 'block', color: '#006666', fontWeight: 800, marginTop: 4 }}>
                  {formatPrice(listing.price)}
                </span>
              </span>
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
