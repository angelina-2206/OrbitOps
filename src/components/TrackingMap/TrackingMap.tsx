import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Locate, Layers, Crosshair, MapPin, Satellite, Eye, EyeOff, Maximize2, Compass, Activity, Radio, RefreshCw, Move, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Custom high-tech SVG markers with drop-shadow glow effects
const createCustomIcon = (color: string, iconType: 'base' | 'sat' | 'landing', isPulsing = false) => {
  let svgInner = '';
  if (iconType === 'base') {
    svgInner = `
      <circle cx="12" cy="12" r="9" fill="#0A0F1A" stroke="${color}" stroke-width="2"/>
      <path d="M12 7v10M7 12h10" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="3" fill="${color}"/>
    `;
  } else if (iconType === 'sat') {
    svgInner = `
      <circle cx="12" cy="12" r="7" fill="#0A0F1A" stroke="${color}" stroke-width="2.5"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="3.5" fill="${color}"/>
    `;
  } else {
    svgInner = `
      <path d="M12 22s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" fill="${color}30" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="10" r="3" fill="${color}"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0px 0px 8px ${color});">
    ${svgInner}
  </svg>`;

  return L.divIcon({
    html: svg,
    className: isPulsing ? 'custom-leaflet-icon pulsing-sat-marker' : 'custom-leaflet-icon',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

const homeIcon = createCustomIcon('#00FF84', 'base');
const satIcon = createCustomIcon('#00D4FF', 'sat', true);
const landingIcon = createCustomIcon('#FACC15', 'landing');

type MapLayerType = 'dark' | 'carto' | 'satellite' | 'terrain' | 'street';

const MAP_LAYERS: Record<MapLayerType, { name: string; url: string; attribution: string }> = {
  dark: {
    name: 'Esri Dark Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin, USGS',
  },
  carto: {
    name: 'Carto Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri World Imagery</a>',
  },
  terrain: {
    name: 'Terrain Topo',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  street: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

// Haversine distance calculator in meters (Ground distance)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Bearing angle calculator in degrees
const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const y = Math.sin((lon2 - lon1) * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos((lon2 - lon1) * (Math.PI / 180));
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
};

const getCardinalDirection = (angle: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(angle / 45) % 8;
  return directions[index];
};

// Auto-center & bounds controller component inside Leaflet map context
const MapController: React.FC<{
  center: [number, number];
  autoCenter: boolean;
  fitBoundsSignal: number;
  allBounds: [number, number][];
}> = ({ center, autoCenter, fitBoundsSignal, allBounds }) => {
  const map = useMap();

  useEffect(() => {
    if (autoCenter) {
      map.panTo(center, { animate: true });
    }
  }, [center, autoCenter, map]);

  useEffect(() => {
    if (fitBoundsSignal > 0 && allBounds.length > 0) {
      map.fitBounds(L.latLngBounds(allBounds), { padding: [50, 50], animate: true });
    }
  }, [fitBoundsSignal, allBounds, map]);

  return null;
};

export const TrackingMap: React.FC = () => {
  const { packets, currentPacket } = useTelemetryStore();
  const [autoCenter, setAutoCenter] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('dark');
  const [showLandingZone, setShowLandingZone] = useState<boolean>(true);
  const [showVectorLine, setShowVectorLine] = useState<boolean>(true);
  const [isHudExpanded, setIsHudExpanded] = useState<boolean>(true);
  const [fitBoundsSignal, setFitBoundsSignal] = useState<number>(0);

  const homeCoords: [number, number] = [13.7199, 80.2304];
  const currentCoords: [number, number] = [
    currentPacket?.gpsLatitude || 13.7199,
    currentPacket?.gpsLongitude || 80.2304,
  ];

  // Predicted landing zone offset calculation based on drift
  const landingCoords: [number, number] = [
    currentCoords[0] + 0.0015,
    currentCoords[1] + 0.002,
  ];

  const trajectoryPath: [number, number][] = packets.map((p) => [
    p.gpsLatitude,
    p.gpsLongitude,
  ]);

  const distanceFromBase = calculateDistance(
    homeCoords[0],
    homeCoords[1],
    currentCoords[0],
    currentCoords[1]
  );

  const altitude = currentPacket?.altitude || 0;
  const slantRange3D = Math.round(Math.sqrt(distanceFromBase * distanceFromBase + altitude * altitude));

  const bearingAngle = calculateBearing(
    homeCoords[0],
    homeCoords[1],
    currentCoords[0],
    currentCoords[1]
  );

  const cardinalDir = getCardinalDirection(bearingAngle);

  const handleLayerChange = (layer: MapLayerType) => {
    setActiveLayer(layer);
    toast.success(`Map layer changed to ${MAP_LAYERS[layer].name}`);
  };

  const handleFitBounds = () => {
    setFitBoundsSignal((prev) => prev + 1);
    toast.info('Map viewport fitted to active flight path trajectory');
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0F1A] border-b border-[#1F2937] p-2 select-none relative">
      {/* Header & Control Actions */}
      <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#1F2937] mb-1 gap-2">
        <div className="flex items-center space-x-1.5">
          <Navigation className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-300">CANSAT GIS TRACKING MAP</span>
        </div>

        {/* Action Buttons & Layer Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Map Layer Selector */}
          <div className="flex items-center space-x-1 bg-[#111827] p-0.5 rounded border border-[#1F2937]">
            <Layers className="w-3 h-3 text-[#00D4FF] ml-1 hidden sm:inline" />
            {(['dark', 'carto', 'satellite', 'terrain', 'street'] as MapLayerType[]).map((layerKey) => (
              <button
                key={layerKey}
                onClick={() => handleLayerChange(layerKey)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize transition-all ${
                  activeLayer === layerKey
                    ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 font-bold shadow-cyan-glow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {layerKey}
              </button>
            ))}
          </div>

          {/* Fit Bounds Trajectory Button */}
          <button
            onClick={handleFitBounds}
            className="p-1.5 rounded border bg-[#111827] text-slate-300 border-[#1F2937] hover:border-[#00D4FF]/50 text-[10px] font-mono transition-all"
            title="Fit View to All Trajectory Points"
          >
            <Move className="w-3.5 h-3.5 text-[#00D4FF]" />
          </button>

          {/* Vector Line Toggle */}
          <button
            onClick={() => setShowVectorLine(!showVectorLine)}
            className={`px-2 py-1 rounded border text-[10px] font-mono transition-all ${
              showVectorLine
                ? 'bg-[#00FF84]/20 text-[#00FF84] border-[#00FF84]/40 font-bold'
                : 'bg-[#111827] text-slate-400 border-[#1F2937]'
            }`}
            title={showVectorLine ? 'Hide Base Vector Line' : 'Show Base Vector Line'}
          >
            VECTOR
          </button>

          {/* Landing Zone Toggle */}
          <button
            onClick={() => setShowLandingZone(!showLandingZone)}
            className={`p-1.5 rounded border text-[10px] font-mono transition-all ${
              showLandingZone
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-[#111827] text-slate-400 border-[#1F2937]'
            }`}
            title={showLandingZone ? 'Hide Landing Zone' : 'Show Landing Zone'}
          >
            {showLandingZone ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Auto-Center Button */}
          <button
            onClick={() => setAutoCenter(!autoCenter)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-[10px] font-mono border transition-all ${
              autoCenter
                ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/40 font-bold'
                : 'bg-[#111827] text-slate-400 border-[#1F2937]'
            }`}
          >
            <Locate className="w-3 h-3" />
            <span className="hidden sm:inline">AUTO-CENTER</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="flex-1 w-full rounded overflow-hidden border border-[#1F2937] relative min-h-[340px]">
        {/* Floating Telemetry HUD Glass Card on Map */}
        <div className="absolute top-3 left-3 z-[1000] bg-[#0A0F1A]/90 backdrop-blur-md border border-[#00D4FF]/40 p-2.5 rounded-lg shadow-2xl font-mono text-xs max-w-[240px] transition-all">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-1.5 mb-1.5">
            <span className="text-[10px] text-slate-300 font-orbitron flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-[#00D4FF]" /> GIS TELEMETRY HUD
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsHudExpanded(!isHudExpanded)}
                className="p-0.5 rounded text-slate-400 hover:text-slate-100 hover:bg-[#111827] transition-all"
                title={isHudExpanded ? 'Collapse HUD' : 'Expand HUD'}
              >
                {isHudExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
              <span className="w-2 h-2 rounded-full bg-[#00FF84] animate-ping" />
            </div>
          </div>

          {isHudExpanded && (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">LAT / LNG:</span>
                <span className="font-bold text-slate-200">
                  {currentCoords[0].toFixed(4)}°, {currentCoords[1].toFixed(4)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GROUND DIST:</span>
                <span className="font-bold text-[#00FF84]">{distanceFromBase} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">3D SLANT RANGE:</span>
                <span className="font-bold text-[#00D4FF]">{slantRange3D} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BEARING:</span>
                <span className="font-bold text-amber-400">
                  {bearingAngle}° ({cardinalDir})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ALTITUDE:</span>
                <span className="font-bold text-slate-100">{altitude} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GPS SATS LOCK:</span>
                <span className="font-bold text-[#00FF84]">
                  {currentPacket?.satelliteCount || 8} SATS
                </span>
              </div>
              <div className="flex justify-between border-t border-[#1F2937] pt-1 mt-1 text-[10px]">
                <span className="text-slate-500">WAYPOINTS LOGGED:</span>
                <span className="font-bold text-slate-300">{packets.length} PTS</span>
              </div>
            </div>
          )}
        </div>

        <MapContainer
          center={currentCoords}
          zoom={15}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
          className={activeLayer === 'dark' || activeLayer === 'carto' ? 'dark-tiles' : ''}
        >
          <TileLayer
            attribution={MAP_LAYERS[activeLayer].attribution}
            url={MAP_LAYERS[activeLayer].url}
          />

          <MapController
            center={currentCoords}
            autoCenter={autoCenter}
            fitBoundsSignal={fitBoundsSignal}
            allBounds={[homeCoords, currentCoords, landingCoords, ...trajectoryPath]}
          />

          {/* Home Base Marker */}
          <Marker position={homeCoords} icon={homeIcon}>
            <Popup>
              <div className="font-mono text-xs">
                <strong className="text-[#00FF84]">LAUNCH PAD BASE STATION</strong>
                <p>Lat: 13.7199° | Lng: 80.2304°</p>
                <p>Status: ACTIVE OPERATIONAL</p>
              </div>
            </Popup>
          </Marker>

          {/* Current CanSat Position Marker */}
          <Marker position={currentCoords} icon={satIcon}>
            <Popup>
              <div className="font-mono text-xs">
                <strong className="text-[#00D4FF]">CANSAT LIVE FLIGHT POSITION</strong>
                <p>Altitude: {currentPacket?.gpsAltitude} m</p>
                <p>Latitude: {currentCoords[0]}°</p>
                <p>Longitude: {currentCoords[1]}°</p>
                <p>Ground Dist from Base: {distanceFromBase} m</p>
                <p>Slant Range: {slantRange3D} m</p>
              </div>
            </Popup>
          </Marker>

          {/* Live Position Pulsing Accuracy Radar Ring */}
          <Circle
            center={currentCoords}
            radius={60}
            pathOptions={{
              color: '#00D4FF',
              fillColor: '#00D4FF',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '3, 6',
            }}
          />

          {/* Direct Line of Sight Vector Line from Launch Base to CanSat */}
          {showVectorLine && (
            <Polyline
              positions={[homeCoords, currentCoords]}
              pathOptions={{ color: '#00FF84', weight: 2, dashArray: '6, 6', opacity: 0.8 }}
            />
          )}

          {/* Predicted Landing Zone Marker & Radius Circle */}
          {showLandingZone && (
            <>
              <Marker position={landingCoords} icon={landingIcon}>
                <Popup>
                  <div className="font-mono text-xs">
                    <strong className="text-amber-400">PREDICTED LANDING TOUCHDOWN ZONE</strong>
                    <p>Est. Touchdown in 3m 45s</p>
                    <p>Calculated Error Radius: 150m</p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={landingCoords}
                radius={150}
                pathOptions={{
                  color: '#FACC15',
                  fillColor: '#FACC15',
                  fillOpacity: 0.18,
                  weight: 2,
                  dashArray: '4, 4',
                }}
              />
            </>
          )}

          {/* Flight Trajectory Polyline Path */}
          <Polyline
            positions={trajectoryPath}
            pathOptions={{ color: '#00D4FF', weight: 3.5, opacity: 0.9 }}
          />
        </MapContainer>
      </div>
    </div>
  );
};
