import React from "react";
import styles from "./Background.module.scss";
import className from "src/lib/className";
import { BackgroundProps } from "./Background";

const FrontLayer: React.FC<BackgroundProps> = ({ frontLayer }) => (
  <>
    <div
      className={className({
        [styles.news]: frontLayer === "news",
        [styles.background]: true,
      })}
    />
  </>
);

export default FrontLayer;
