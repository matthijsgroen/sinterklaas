import React from "react";
import styles from "./Hiddo.module.scss";

export interface HiddoProps {
  body?: "default";
  expression?: "happy" | "hmm" | "sip";
}

const Piet: React.FC<HiddoProps> = ({
  body = "default",
  expression = "happy",
}) => <div className={styles.hiddo}></div>;

export default Piet;
