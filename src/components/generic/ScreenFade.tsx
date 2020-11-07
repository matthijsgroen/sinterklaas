import React from "react";
import styles from "./ScreenFade.module.scss";

export interface ScreenFadeProps {
  active: boolean | number;
  color: string;
}

const ScreenFade: React.FC<ScreenFadeProps> = ({ active, color }) => (
  <div
    className={styles.screenFade}
    style={{
      backgroundColor: color,
      opacity: active === true ? "1.0" : active === false ? "0" : `${active}`,
    }}
  ></div>
);

export default ScreenFade;
