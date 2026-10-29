/** Reverse-geocode coordinates to a short address via OpenStreetMap Nominatim. */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&lat=${lat}&lon=${lng}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return fallback;
    const data = await res.json();
    const a = data.address ?? {};
    const parts = [
      a.road || a.neighbourhood,
      a.suburb || a.village,
      a.city || a.town || a.county,
      a.state,
      a.postcode,
    ].filter(Boolean);
    const unique = parts.filter((p: string, i: number) => parts.indexOf(p) === i);
    return unique.length ? unique.join(', ') : (data.display_name ?? fallback);
  } catch {
    return fallback;
  }
}
