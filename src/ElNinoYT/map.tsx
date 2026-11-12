import React, { createContext, useContext, useMemo } from "react";
import { geoGraticule10, geoNaturalEarth1, geoPath, GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { brand, brandFont } from "../brand/theme";

const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const countries = (feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>).features;
export const countryById = (id: string) => countries.find((c) => String(c.id) === id) as Feature<Geometry> | undefined;

export const W = 1920;
export const H = 1080;

/** Camera: centre longitude/latitude and zoom (1 = whole world fits the frame). */
export type Camera = { lon: number; lat: number; zoom: number };

export const makeProjection = ({ lon, lat, zoom }: Camera, w = W, h = H): GeoProjection =>
  geoNaturalEarth1()
    .rotate([-lon, 0])
    .center([0, lat])
    .scale(330 * zoom)
    .translate([w / 2, h / 2]);

const ProjCtx = createContext<GeoProjection>(makeProjection({ lon: -160, lat: 0, zoom: 1 }));
export const useProjection = () => useContext(ProjCtx);

/** Linear blend of two cameras (zoom blended in log space so it feels even). */
export const lerpCam = (a: Camera, b: Camera, t: number): Camera => ({
  lon: a.lon + (b.lon - a.lon) * t,
  lat: a.lat + (b.lat - a.lat) * t,
  zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * t),
});

export type Highlight = { ids: string[]; color: string; opacity?: number };

/** Dark glass world map with optional highlighted countries and SVG overlays drawn in map space. */
export const WorldMap: React.FC<{
  camera: Camera;
  highlights?: Highlight[];
  children?: React.ReactNode;
  dim?: number;
  /** Map viewport size (defaults to the full 16:9 frame). */
  w?: number;
  h?: number;
}> = ({ camera, highlights = [], children, dim = 1, w = W, h = H }) => {
  const key = `${camera.lon.toFixed(2)}|${camera.lat.toFixed(2)}|${camera.zoom.toFixed(3)}|${w}|${h}`;
  const projection = useMemo(() => makeProjection(camera, w, h), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const path = useMemo(() => geoPath(projection), [projection]);
  const land = useMemo(() => countries.map((c) => ({ id: String(c.id), d: path(c) ?? "" })), [path]);
  const grid = useMemo(() => path(geoGraticule10()) ?? "", [path]);
  const sphere = useMemo(() => path({ type: "Sphere" }) ?? "", [path]);
  const colorOf = (id: string) => {
    for (const h of highlights) if (h.ids.includes(id)) return h;
    return null;
  };
  return (
    <ProjCtx.Provider value={projection}>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, opacity: dim }}>
        <defs>
          <radialGradient id="ocean" cx="50%" cy="45%" r="70%">
            <stop offset="0" stopColor="#14142a" />
            <stop offset="1" stopColor="#07070d" />
          </radialGradient>
        </defs>
        <path d={sphere} fill="url(#ocean)" />
        <path d={grid} fill="none" stroke="#ffffff10" strokeWidth={1} />
        {land.map(({ id, d }) => {
          const h = colorOf(id);
          return (
            <path
              key={id}
              d={d}
              fill={h ? h.color : "#2a2838"}
              fillOpacity={h ? h.opacity ?? 0.85 : 0.9}
              stroke={h ? "#ffffffaa" : "#ffffff26"}
              strokeWidth={h ? 1.5 : 0.8}
              style={h ? { filter: `drop-shadow(0 0 10px ${h.color})` } : undefined}
            />
          );
        })}
        {children}
      </svg>
    </ProjCtx.Provider>
  );
};

/** A projected point helper for overlays. */
export const useP = () => {
  const p = useProjection();
  return (lon: number, lat: number) => (p([lon, lat]) ?? [0, 0]) as [number, number];
};

/** Glowing blurred blob of sea-surface temperature, centred at lon/lat with radii in degrees. */
export const SeaBlob: React.FC<{ lon: number; lat: number; rLon: number; rLat: number; color: string; opacity?: number }> = ({ lon, lat, rLon, rLat, color, opacity = 0.75 }) => {
  const P = useP();
  const [x, y] = P(lon, lat);
  const [x2] = P(lon + rLon, lat);
  const [, y2] = P(lon, lat + rLat);
  const rx = Math.abs(x2 - x);
  const ry = Math.abs(y - y2);
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} opacity={opacity} style={{ filter: `blur(${Math.max(rx, ry) * 0.35}px)`, mixBlendMode: "screen" }} />;
};

/** Animated dashed arrow between two lon/lat points (curved slightly). */
export const MapArrow: React.FC<{ from: [number, number]; to: [number, number]; color?: string; progress?: number; dash?: number; width?: number; bend?: number }> = ({
  from,
  to,
  color = brand.ink,
  progress = 1,
  dash = 0,
  width = 6,
  bend = 0,
}) => {
  const P = useP();
  const [x1, y1] = P(...from);
  const [x2, y2] = P(...to);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - bend;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.1;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const show = progress > 0.98;
  return (
    <g style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash ? `${dash} ${dash * 1.6}` : `${len}`} strokeDashoffset={dash ? 0 : len * (1 - progress)} />
      {show ? (
        <polygon
          points={`0,0 -26,-13 -26,13`}
          fill={color}
          transform={`translate(${x2} ${y2}) rotate(${(ang * 180) / Math.PI})`}
        />
      ) : null}
    </g>
  );
};

/** Label pinned to a lon/lat point. */
export const MapLabel: React.FC<{ lon: number; lat: number; children: React.ReactNode; color?: string; size?: number; dx?: number; dy?: number }> = ({ lon, lat, children, color = brand.ink, size = 34, dx = 0, dy = 0 }) => {
  const P = useP();
  const [x, y] = P(lon, lat);
  return (
    <text x={x + dx} y={y + dy} textAnchor="middle" fill={color} fontFamily={brandFont} fontWeight={800} fontSize={size} style={{ paintOrder: "stroke", stroke: "#07070bcc", strokeWidth: 8 }}>
      {children}
    </text>
  );
};

/** <clipPath id={id}> holding one country's outline in the current projection. */
export const CountryClip: React.FC<{ id: string; country: string }> = ({ id, country }) => {
  const projection = useProjection();
  const f = countryById(country);
  const d = f ? geoPath(projection)(f) ?? "" : "";
  return (
    <defs>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
    </defs>
  );
};
