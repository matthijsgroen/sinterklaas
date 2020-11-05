import React from "react";
import styles from "./Piet.module.scss";
// import className from "../../lib/className";

export interface PietProps {
  body?: "default";
  expression?: string;
}

const Piet: React.FC<PietProps> = ({
  body = "default",
  expression = "default",
}) => (
  <div className={styles.piet}>
    <div className={styles.hairBack} />
  </div>
);

export default Piet;
