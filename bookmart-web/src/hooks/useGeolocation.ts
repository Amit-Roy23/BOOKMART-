"use client";

export function useGeolocation() {
  return {
    getCurrentPosition: () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }),
    watchPosition: (onSuccess: (position: GeolocationPosition) => void, onError: (error: GeolocationPositionError) => void) => {
      if (!navigator.geolocation) {
        onError({
          code: 2,
          message: "Geolocation is not supported",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
        return null;
      }
      return navigator.geolocation.watchPosition(onSuccess, onError);
    },
    clearWatch: (id: number) => navigator.geolocation.clearWatch(id),
  };
}
