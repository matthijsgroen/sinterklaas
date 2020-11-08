import React from "react";
import styles from "./Hiddo.module.scss";

export interface HiddoProps {
  body?: "default";
  expression?: "happy";
}

const Hiddo: React.FC<HiddoProps> = ({
  body = "default",
  expression = "happy",
}) => (
  <div className={styles.hiddo}>
    <div className={styles.body} />
    <div className={styles[`exp-${expression}`]} />
  </div>
);

export default Hiddo;
