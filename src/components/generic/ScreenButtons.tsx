import React from "react";
import className from "src/lib/className";
import styles from "./ScreenButtons.module.scss";

export type Button = {
  id: string;
  image: string;
  position: [number, number];
  scale?: number;
  visible?: boolean;
  hoverEffect?: "glow" | "shadow";
};

export type Highlight = {
  id: string;
  coordinates: number[];
  color?: string;
  visible?: boolean;
  hoverEffect?: "glow";
};

interface ScreenButtonProps {
  buttons: (Button | Highlight)[];
  buttonActive: boolean;
  onClick: (buttonId: string) => void;
}

const isButton = (item: Highlight | Button): item is Button => "image" in item;

const coordinatesToPolygon = (coords: number[]) => {
  const pairs: string[] = [];
  for (let i = 0; i < coords.length; i += 2) {
    pairs.push(`${coords[i]}px ${coords[i + 1]}px`);
  }
  return `polygon(${pairs.join(",")})`;
};

export const ScreenButtons: React.FC<ScreenButtonProps> = ({
  buttons,
  buttonActive,
  onClick,
}) => {
  const renderButton = ({
    id,
    image,
    position,
    scale = 1.0,
    hoverEffect,
  }: Button) => (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={className({
        [styles.image]: true,
        [styles.glow]: hoverEffect === "glow" && !buttonActive,
        [styles.shadow]: hoverEffect === "shadow" && !buttonActive,
      })}
      style={{
        left: position[0],
        top: position[1],
        transform: `scale(${scale})`,
        backgroundImage: `url(${image}), url(${image})`,
      }}
    >
      <img src={image} alt={id} />
    </div>
  );

  const renderHighlight = ({
    id,
    coordinates,
    hoverEffect,
    color,
  }: Highlight) => (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={className({
        [styles.highlight]: true,
        [styles.glow]: hoverEffect === "glow" && !buttonActive,
      })}
      style={{
        clipPath: coordinatesToPolygon(coordinates),
        backgroundColor: color || "white",
      }}
    ></div>
  );

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      {buttons
        .filter(button => button.visible !== false)
        .map(item =>
          isButton(item) ? renderButton(item) : renderHighlight(item)
        )}
    </div>
  );
};
