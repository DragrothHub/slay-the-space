// import ATTRIBUTE_ICONS from "../attributeIcons";

export function RadarChart({
  attributes,
  max = 100,
  size = 240,
  levels = 5,
}) {
  // Falls keine Attribute vorhanden sind
  if (!attributes || Object.keys(attributes).length === 0) {
    return null;
  }

  const keys = Object.keys(attributes);
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / keys.length;

  const getPoint = (value, index) => {
    const angle = index * angleStep - Math.PI / 2;

    return {
      x: center + Math.cos(angle) * radius * value,
      y: center + Math.sin(angle) * radius * value,
    };
  };

  // Polygon für die Attributwerte
  const valuePoints = keys
    .map((key, index) => {
      const value = (attributes[key] ?? 0) / max;
      const { x, y } = getPoint(value, index);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size}>
      {/* Hintergrund */}
      {Array.from({ length: levels }, (_, level) => {
        const levelValue = (level + 1) / levels;

        const levelPoints = keys
          .map((_, index) => {
            const { x, y } = getPoint(levelValue, index);
            return `${x},${y}`;
          })
          .join(" ");

        return (
          <polygon
            key={level}
            points={levelPoints}
            fill="none"
            stroke="#444"
            strokeWidth="1"
          />
        );
      })}

      {/* Achsen */}
      {keys.map((key, index) => {
        const { x, y } = getPoint(1, index);

        return (
          <line
            key={key}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#666"
            strokeWidth="1"
          />
        );
      })}

      {/* Werte-Polygon */}
      <polygon
        points={valuePoints}
        fill="#99ccff"
        fillOpacity="0.3"
        stroke="#99ccff"
        strokeWidth="2"
      />

      {/* Punkte auf den Werten */}
      {keys.map((key, index) => {
        const value = (attributes[key] ?? 0) / max;
        const { x, y } = getPoint(value, index);

        return (
          <circle
            key={`point-${key}`}
            cx={x}
            cy={y}
            r="3"
            fill="#99ccff"
          />
        );
      })}

      {keys.map((key, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const { x, y } = getPoint(1.0, index);

        const anchor =
          Math.cos(angle) > 0.2
            ? "start"
            : Math.cos(angle) < -0.2
              ? "end"
              : "middle";

        return (
          <text
            key={key}
            x={x}
            y={y}
            fill="white"
            fontSize="12"
            // textAnchor={anchor}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {ATTRIBUTE_LABELS[key] ?? key}
          </text>
        );
      })}

      {/* Icons (aktuell rote Platzhalter)
      {keys.map((key, index) => {
        const { x, y } = getPoint(1.12, index);
        const iconSize = 18;

        return (
          // Wenn du Icons verwenden möchtest, ersetze das rect durch:
          //
          // <image
          //   key={`icon-${key}`}
          //   href={ATTRIBUTE_ICONS[key]}
          //   x={x - iconSize / 2}
          //   y={y - iconSize / 2}
          //   width={iconSize}
          //   height={iconSize}
          //   style={{
          //     filter: "grayscale(100%) brightness(150%) opacity(0.8)",
          //     WebkitFilter:
          //       "grayscale(100%) brightness(150%) opacity(0.8)",
          //   }}
          // />
        );
      })} */}
    </svg>
  );
}

const ATTRIBUTE_LABELS = {
  armorDef: "Armor Def",
  shieldDef: "Shield Def",
  hull: "Hull",
  initiative: "Initiative",
  kineticAtk: "Kinetic Atk",
  laserAtk: "Laser Atk",
};