import React, { ReactElement } from "react";
import styles from "./Character.module.scss";
import className from "src/lib/className";

const cssTransform = (scale: number, mirrored: boolean) =>
  [`scale(${scale})`, mirrored && "matrix(-1, 0, 0, 1, 0, 0)"]
    .filter(Boolean)
    .join(" ");

export interface CharacterProps {
  character: ReactElement;
  mirrored?: boolean;
  x: number;
  y: number;
  z?: number;
  visible?: boolean;
  scale?: number;
}

const Character: React.FC<CharacterProps> = ({
  character,
  mirrored = false,
  x,
  y,
  z = 0,
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
      zIndex: z,
    }}
  >
    {character}
  </div>
);

export default Character;
