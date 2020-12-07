import React from "react";
import className from "src/lib/className";
import styles from "./BackgroundBlur.module.scss";

interface BackgroundBlurProps {
  active: boolean;
}

const BackgroundBlur: React.FC<BackgroundBlurProps> = ({ active }) => (
  <div
    className={className({
      [styles.base]: true,
      [styles.blur]: active,
    })}
  />
);

export default BackgroundBlur;
