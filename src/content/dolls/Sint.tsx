import React from "react";
import className from "src/lib/className";
import styles from "./Sint.module.scss";

export interface SintProps {
  body?: "default" | "book";
  expression?:
    | "happy"
    | "mouth-closed"
    | "wink"
    | "mouth-open-sip"
    | "eyes-down"
    | "reading";
  glasses?: boolean;
}

const Piet: React.FC<SintProps> = ({
  body = "default",
  expression = "happy",
  glasses = false,
}) => (
  <div className={styles.sint}>
    <div
      className={className({
        [styles.body]: body === "default",
        [styles.book]: body === "book",
      })}
    />
    <div className={styles[`exp-${expression}`]} />
    {glasses && <div className={styles.glasses} />}
  </div>
);

export default Piet;
