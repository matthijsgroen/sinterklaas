import React from "react";
import className from "src/lib/className";
import styles from "./Hiddo.module.scss";

export interface HiddoProps {
  body?: "default" | "fists";
  expression?:
    | "happy"
    | "shocked"
    | "enthusiastic"
    | "very-enthusiastic"
    | "mouth-closed";
}

const Hiddo: React.FC<HiddoProps> = ({
  body = "default",
  expression = "happy",
}) => (
  <div className={styles.hiddo}>
    <div
      className={className({
        [styles.body]: body === "default",
        [styles.bodyFists]: body === "fists",
      })}
    />
    <div className={styles[`exp-${expression}`]} />
  </div>
);

export default Hiddo;
