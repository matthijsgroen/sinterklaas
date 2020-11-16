import React from "react";
import className from "src/lib/className";
import styles from "./Piet.module.scss";

export interface PietProps {
  color?: "blue" | "red";
  body?: "default" | "pointUp" | "think";
  expression?:
    | "happy"
    | "hmm"
    | "sip"
    | "grin"
    | "annoyed"
    | "shout"
    | "crying"
    | "small-smile";
  glasses?: boolean;
}

const Piet: React.FC<PietProps> = ({
  body = "default",
  expression = "happy",
  color = "blue",
  glasses = false,
}) => (
  <div className={styles.piet}>
    <div
      className={className({
        [styles.body]:
          color === "blue" && (body === undefined || body === "default"),
        [styles.pointUp]: color === "blue" && body === "pointUp",
        [styles.think]: color === "blue" && body === "think",
        [styles.body2]:
          color === "red" && (body === undefined || body === "default"),
        [styles.pointUp2]: color === "red" && body === "pointUp",
        [styles.think2]: color === "red" && body === "think",
      })}
    />
    <div className={styles[`exp-${expression}`]} />
    {glasses && <div className={styles.glasses} />}
  </div>
);

export default Piet;
