import React from "react";
import styles from "./Background.module.scss";
import className from "src/lib/className";

export interface BackgroundProps {
  image?: "black" | "livingRoom" | "pietenhuis" | "hall";
  kids?: boolean;
  tv?: boolean;
  blur?: boolean;
  frontLayer?: "news";
}

const Background: React.FC<BackgroundProps> = ({ image, kids, tv, blur }) => (
  <>
    <div
      className={className({
        [styles[image || "black"]]: !!image,
        [styles.black]: !image,
        [styles.livingRoom]: image === "livingRoom",
        [styles.pietenhuis]: image === "pietenhuis",
        [styles.hall]: image === "hall",
        [styles.blur]: !!blur,
        [styles.background]: true,
      })}
    />
    {kids && image === "livingRoom" && (
      <div
        className={className({
          [styles.livingRoomKids]: !!kids,
          [styles.background]: true,
        })}
      />
    )}
    {tv && image === "livingRoom" && (
      <div
        className={className({
          [styles.tv]: !!tv,
          [styles.background]: true,
        })}
      />
    )}
  </>
);

export default Background;
