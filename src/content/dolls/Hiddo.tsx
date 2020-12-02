import React from "react";
import className from "src/lib/className";
import styles from "./Hiddo.module.scss";

export interface HiddoProps {
  body?: "default" | "fists" | "open" | "chin" | "wave";
  expression?:
    | "happy"
    | "shocked"
    | "enthusiastic"
    | "very-enthusiastic"
    | "mouth-closed"
    | "question"
    | "sip"
    | "think";
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
        [styles.bodyOpen]: body === "open",
        [styles.chin]: body === "chin",
        [styles.bodyWave]: body === "wave",
      })}
    />
    <div className={styles[`exp-${expression}`]} />
  </div>
);

export default Hiddo;
