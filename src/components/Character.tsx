import React, { ReactElement } from "react";
import styles from "./Character.module.scss";
import className from "../lib/className";

const cssTransform = (scale: number, mirrored: boolean) =>
  [`scale(${scale})`, mirrored && "matrix(-1, 0, 0, 1, 0, 0)"]
    .filter(Boolean)
    .join(" ");

export interface CharacterProps {
  character: ReactElement;
  mirrored?: boolean;
  x: number;
  y: number;
  visible?: boolean;
  scale?: number;
}

const Character: React.FC<CharacterProps> = ({
  character,
  mirrored = false,
  x,
  y,
  visible = true,
  scale = 1.0,
}) => (
  <div
    className={className({
      [styles.character]: true,
      [styles.visible]: visible,
    })}
    style={{
      transform: cssTransform(scale, mirrored),
      left: x,
      top: y,
    }}
  >
    {character}
  </div>
);

export default Character;
