import React from "react";
import className from "src/lib/className";
import styles from "./ScreenButtons.module.scss";

export type Button = {
  id: string;
  image: string;
  visible?: boolean;
  hoverEffect?: "glow";
  position: [number, number];
  scale?: number;
};

interface ScreenButtonProps {
  buttons: Button[];
  onClick: (buttonId: string) => void;
}

export const ScreenButtons: React.FC<ScreenButtonProps> = ({
  buttons,
  onClick,
}) => (
  <div
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
    }}
  >
    {buttons
      .filter(button => button.visible !== false)
      .map(({ id, image, position, scale = 1.0, hoverEffect }) => (
        <div
          key={id}
          onClick={() => onClick(id)}
          className={className({
            [styles.image]: true,
            [styles.glow]: hoverEffect === "glow",
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
      ))}
  </div>
);
