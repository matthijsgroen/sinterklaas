import React from "react";
import className from "src/lib/className";
import styles from "./Piet.module.scss";

export interface PietProps {
  body?: "default" | "pointUp" | "think";
  expression?: "happy" | "hmm" | "sip";
}

const Piet: React.FC<PietProps> = ({
  body = "default",
  expression = "happy",
}) => (
  <div className={styles.piet}>
    <div
      className={className({
        [styles.body]: body === undefined || body === "default",
        [styles.pointUp]: body === "pointUp",
        [styles.think]: body === "think",
      })}
    />
    <div className={styles[`exp-${expression}`]} />
  </div>
);

export default Piet;
