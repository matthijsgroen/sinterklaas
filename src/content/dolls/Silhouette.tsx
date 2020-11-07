import React from "react";
import styles from "./Silhouette.module.scss";
import className from "../../lib/className";

export interface SilhouetteProps {
  sil: "reporter";
}

const Silhouette: React.FC<SilhouetteProps> = ({ sil }) => (
  <div
    className={className({
      [styles.silhouette]: true,
      [styles.reporter]: sil === "reporter",
    })}
  />
);

export default Silhouette;
