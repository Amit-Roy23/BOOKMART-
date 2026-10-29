import { COLORS } from "@/constants/colors";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export interface LeafletMapViewRef {
  centerOnUser: () => void;
  selectBook: (bookId: string) => void;
  fitToCoordinates: (coords: { latitude: number; longitude: number }[]) => void;
}

interface LeafletMapViewProps {
  userLocation: { latitude: number; longitude: number } | null;
  books: any[];
  selectedBookId: string | null;
  onBookPress: (book: any) => void;
  routeCoords?: { latitude: number; longitude: number }[];
}

const LeafletMapView = forwardRef<LeafletMapViewRef, LeafletMapViewProps>(
  ({ userLocation, books, selectedBookId, onBookPress, routeCoords }, ref) => {
    const webViewRef = useRef<WebView>(null);

    const userLat = userLocation?.latitude || 22.8943;
    const userLng = userLocation?.longitude || 88.4239;

    useImperativeHandle(ref, () => ({
      centerOnUser: () => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            if (window.map && window.userMarker) {
              window.map.flyTo([${userLat}, ${userLng}], 15, { animate: true, duration: 0.8 });
            }
            true;
          `);
        }
      },
      selectBook: (bookId: string) => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            if (window.selectBookById) {
              window.selectBookById("${bookId}");
            }
            true;
          `);
        }
      },
      fitToCoordinates: (coords: { latitude: number; longitude: number }[]) => {
        if (webViewRef.current && coords.length > 0) {
          const latLngs = JSON.stringify(coords.map((c) => [c.latitude, c.longitude]));
          webViewRef.current.injectJavaScript(`
            if (window.map) {
              window.map.fitBounds(${latLngs}, { padding: [50, 50], animate: true });
            }
            true;
          `);
        }
      },
    }));

    // Update markers and route when books or selection change
    useEffect(() => {
      if (webViewRef.current) {
        const payload = JSON.stringify({
          userLocation: { latitude: userLat, longitude: userLng },
          books,
          selectedBookId,
          routeCoords: routeCoords || [],
        });
        webViewRef.current.injectJavaScript(`
          if (window.updateMapData) {
            window.updateMapData(${payload});
          }
          true;
        `);
      }
    }, [userLat, userLng, books, selectedBookId, routeCoords]);

    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "BOOK_SELECTED") {
          const foundBook = books.find((b) => b.id === data.bookId);
          if (foundBook) {
            onBookPress(foundBook);
          }
        }
      } catch (e) {
        console.error("Error parsing map message:", e);
      }
    };

    const initialPayload = JSON.stringify({
      userLocation: { latitude: userLat, longitude: userLng },
      books,
      selectedBookId,
      routeCoords: routeCoords || [],
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    .user-pulse-marker {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${COLORS.primary};
      border: 3px solid #ffffff;
      box-shadow: 0 0 10px rgba(0, 128, 128, 0.6);
      position: relative;
    }
    .user-pulse-marker::after {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border-radius: 50%;
      border: 2px solid ${COLORS.primary};
      animation: pulse 1.8s infinite ease-out;
    }
    @keyframes pulse {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .book-marker-container {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .book-bubble {
      background: ${COLORS.primary};
      color: #ffffff;
      border: 2px solid #ffffff;
      border-radius: 18px;
      padding: 4px 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    .book-bubble svg {
      width: 12px;
      height: 12px;
      fill: #ffffff;
    }
    .book-bubble-selected {
      background: ${COLORS.primary};
      border-color: #A7F3D0;
      transform: scale(1.18);
      box-shadow: 0 6px 16px rgba(0, 128, 128, 0.5);
    }
    .book-arrow {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid ${COLORS.primary};
      margin-top: -1px;
    }
    .leaflet-control-attribution, .leaflet-control-zoom {
      display: none !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map;
    var userMarker;
    var radiusCircle;
    var routePolyline;
    var bookMarkers = {};
    var currentData = ${initialPayload};

    function initMap() {
      var center = [currentData.userLocation.latitude, currentData.userLocation.longitude];
      
      map = L.map('map', {
        center: center,
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      // Ultra-crisp CartoDB Voyager tile layer with OpenStreetMap backup
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        fallbackTileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      }).addTo(map);

      renderUserLocation(currentData.userLocation);
      renderBookMarkers(currentData.books, currentData.selectedBookId);
      renderRoute(currentData.routeCoords);
    }

    function renderUserLocation(loc) {
      if (!loc) return;
      if (userMarker) map.removeLayer(userMarker);
      if (radiusCircle) map.removeLayer(radiusCircle);

      var userIcon = L.divIcon({
        className: 'user-pulse-icon',
        html: '<div class="user-pulse-marker"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      userMarker = L.marker([loc.latitude, loc.longitude], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);

      radiusCircle = L.circle([loc.latitude, loc.longitude], {
        radius: 1000,
        color: '${COLORS.primary}',
        fillColor: '${COLORS.primary}',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 6'
      }).addTo(map);
    }

    function renderBookMarkers(books, selectedId) {
      Object.keys(bookMarkers).forEach(function(k) {
        map.removeLayer(bookMarkers[k]);
      });
      bookMarkers = {};

      if (!books || !books.length) return;

      books.forEach(function(book) {
        if (!book.latitude || !book.longitude) return;

        var isSelected = String(book.id) === String(selectedId);
        var iconHtml = '<div class="book-marker-container' + (isSelected ? ' selected' : '') + '" onclick="onMarkerClick(\\'' + book.id + '\\')">' +
          '<div class="book-bubble' + (isSelected ? ' book-bubble-selected' : '') + '">' +
            '<svg viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>' +
            '<span>₹' + book.price + '</span>' +
          '</div>' +
          '<div class="book-arrow"></div>' +
        '</div>';

        var icon = L.divIcon({
          className: 'custom-book-pin',
          html: iconHtml,
          iconSize: [60, 36],
          iconAnchor: [30, 36]
        });

        var marker = L.marker([book.latitude, book.longitude], {
          icon: icon,
          zIndexOffset: isSelected ? 500 : 100
        }).addTo(map);

        marker.on('click', function() {
          onMarkerClick(book.id);
        });

        bookMarkers[book.id] = marker;
      });
    }

    function renderRoute(coords) {
      if (routePolyline) map.removeLayer(routePolyline);

      if (coords && coords.length > 0) {
        var latLngs = coords.map(function(c) { return [c.latitude, c.longitude]; });
        routePolyline = L.polyline(latLngs, {
          color: '${COLORS.primary}',
          weight: 4,
          opacity: 0.85,
          smoothFactor: 1
        }).addTo(map);
      }
    }

    function onMarkerClick(bookId) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'BOOK_SELECTED',
          bookId: String(bookId)
        }));
      }
    }

    window.updateMapData = function(data) {
      currentData = data;
      renderUserLocation(data.userLocation);
      renderBookMarkers(data.books, data.selectedBookId);
      renderRoute(data.routeCoords);

      if (data.selectedBookId && bookMarkers[data.selectedBookId]) {
        var book = data.books.find(function(b) { return String(b.id) === String(data.selectedBookId); });
        if (book && data.userLocation) {
          var bounds = L.latLngBounds([
            [data.userLocation.latitude, data.userLocation.longitude],
            [book.latitude, book.longitude]
          ]);
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
        }
      }
    };

    window.selectBookById = function(bookId) {
      onMarkerClick(bookId);
    };

    document.addEventListener('DOMContentLoaded', initMap);
  </script>
</body>
</html>
    `;

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webView}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          androidLayerType="hardware"
        />
      </View>
    );
  }
);

export default React.memo(LeafletMapView);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
    backgroundColor: "#F4F6F8",
  },
  webView: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#F4F6F8",
  },
});
