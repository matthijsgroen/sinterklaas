import React from "react";
import styles from "./ScreenScale.module.scss";
import classNameHelper from "src/lib/className";
import useWindowSize from "../hooks/useWindowSize";

export interface ScreenScaleProps {
  className?: string;
}

const ScreenScale: React.FC<ScreenScaleProps> = ({ children, className }) => {
  const windowSize = useWindowSize();
  const scale =
    windowSize.height &&
    windowSize.width &&
    Math.min(windowSize.height / 720, windowSize.width / 1280);

  return (
    <div
      style={{ transform: `scale(${scale})` }}
      className={styles.sceneZoomContainer}
    >
      <div
        className={classNameHelper({
          [styles.scene]: true,
          [className || ""]: !!className,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default ScreenScale;
