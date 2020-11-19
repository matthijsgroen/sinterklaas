import React from "react";
import styles from "./Sint.module.scss";

export interface SintProps {
  body?: "default";
  expression?: "happy";
}

const Piet: React.FC<SintProps> = ({
  body = "default",
  expression = "happy",
}) => (
  <div className={styles.sint}>
    <div className={styles.body} />
    <div className={styles[`exp-${expression}`]} />
  </div>
);

export default Piet;
