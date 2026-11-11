import React from "react";

/** Simple line icons drawn on top of an accent square in the label card. */
const P: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export type IconName = "sun" | "wave" | "pin" | "star" | "chat" | "question" | "chart" | "check" | "tag" | "alert" | "shield" | "calendar" | "bolt" | "person";

export const Icon: React.FC<{ name: IconName; color: string }> = ({ name, color }) => {
  switch (name) {
    case "sun":
      return (
        <P color={color}>
          <circle cx={12} cy={12} r={4} />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </P>
      );
    case "wave":
      return (
        <P color={color}>
          <path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
        </P>
      );
    case "pin":
      return (
        <P color={color}>
          <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
          <circle cx={12} cy={10} r={2.5} />
        </P>
      );
    case "star":
      return (
        <P color={color}>
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
        </P>
      );
    case "chat":
      return (
        <P color={color}>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z" />
        </P>
      );
    case "question":
      return (
        <P color={color}>
          <circle cx={12} cy={12} r={9.5} />
          <path d="M9.3 9a2.8 2.8 0 0 1 5.4 1c0 2-2.7 2.5-2.7 4M12 17.5h.01" />
        </P>
      );
    case "chart":
      return (
        <P color={color}>
          <path d="M3 20h18M6 16v-4M11 16V8M16 16v-6M21 16V5" />
        </P>
      );
    case "check":
      return (
        <P color={color}>
          <path d="M4 12.5l5 5L20 6.5" />
        </P>
      );
    case "tag":
      return (
        <P color={color}>
          <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
          <circle cx={8} cy={8} r={1.5} />
        </P>
      );
    case "alert":
      return (
        <P color={color}>
          <path d="M12 3l9.5 17h-19z" />
          <path d="M12 10v4M12 17.5h.01" />
        </P>
      );
    case "shield":
      return (
        <P color={color}>
          <path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" />
          <path d="M8.5 12l2.5 2.5 4.5-5" />
        </P>
      );
    case "calendar":
      return (
        <P color={color}>
          <rect x={3} y={5} width={18} height={16} rx={2} />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </P>
      );
    case "bolt":
      return (
        <P color={color}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
        </P>
      );
    default:
      return (
        <P color={color}>
          <circle cx={12} cy={8} r={4} />
          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </P>
      );
  }
};
