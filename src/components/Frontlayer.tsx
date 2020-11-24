import React from "react";
import styles from "./Background.module.scss";
import className from "src/lib/className";
import { BackgroundProps } from "./Background";

const FrontLayer: React.FC<BackgroundProps> = ({ frontLayer }) => (
  <>
    <div
      className={className({
        [styles.news]: frontLayer === "news",
        [styles.drawing1]: frontLayer === "drawing1",
        [styles.drawing2]: frontLayer === "drawing2",
        [styles.background]: true,
      })}
    />
  </>
);

export default FrontLayer;
