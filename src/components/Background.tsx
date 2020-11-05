import React from "react";
import styles from "./Background.module.scss";
import className from "../lib/className";

export interface BackgroundProps {
  image?: "black" | "livingRoom" | "livingRoomKids" | "pietenhuis";
}

const Background: React.FC<BackgroundProps> = ({ image }) => (
  <>
    <div
      className={className({
        [styles[image || "black"]]: !!image,
        [styles.black]: !image,
        [styles.livingRoom]: image === "livingRoom",
        [styles.livingRoomKids]: image === "livingRoomKids",
        [styles.pietenhuis]: image === "pietenhuis",
        [styles.background]: true,
      })}
    />
  </>
);

export default Background;
