import React from "react";
import styles from "./Piet.module.scss";

export interface PietProps {
  body?: "default";
  expression?: "happy" | "hmm";
}

const Piet: React.FC<PietProps> = ({
  body = "default",
  expression = "happy",
}) => (
  <div className={styles.piet}>
    <div className={styles.body} />
    <div className={styles[`exp-${expression}`]} />
  </div>
);

export default Piet;
