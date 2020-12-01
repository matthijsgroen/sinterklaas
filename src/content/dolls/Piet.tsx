import React from "react";
import className from "src/lib/className";
import styles from "./Piet.module.scss";

export interface PietProps {
  color?: "blue" | "red" | "white";
  body?: "default" | "pointUp" | "think" | "hip";
  expression?:
    | "happy"
    | "hmm"
    | "sip"
    | "grin"
    | "annoyed"
    | "shout"
    | "crying"
    | "small-smile"
    | "sip2"
    | "sip-open"
    | "concentrated"
    | "defeated"
    | "wink";
  glasses?: boolean;
  cooking?: boolean;
}

const Piet: React.FC<PietProps> = ({
  body = "default",
  expression = "happy",
  color = "blue",
  glasses = false,
  cooking = false,
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

        [styles.body3]:
          color === "white" && (body === undefined || body === "default"),
        [styles.pointUp3]: color === "white" && body === "pointUp",
        [styles.think3]: color === "white" && body === "think",
        [styles.hip3]: color === "white" && body === "hip",
        [styles.cooking]: !!cooking === true,
      })}
    />
    <div className={styles[`exp-${expression}`]} />
    {glasses && <div className={styles.glasses} />}
  </div>
);

export default Piet;
