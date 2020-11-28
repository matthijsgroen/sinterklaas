import React from "react";
import styles from "./Sint.module.scss";

export interface SintProps {
  body?: "default";
  expression?: "happy";
  glasses?: boolean;
}

const Piet: React.FC<SintProps> = ({
  body = "default",
  expression = "happy",
  glasses = false,
}) => (
  <div className={styles.sint}>
    <div className={styles.body} />
    <div className={styles[`exp-${expression}`]} />
    {glasses && <div className={styles.glasses} />}
  </div>
);

export default Piet;
