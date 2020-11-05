import React from "react";
import styles from "./Scene.module.scss";
import className from "../lib/className";
import useWindowSize from "./hooks/useWindowSize";

export interface SceneProps {
  horizontalPunch?: boolean;
  verticalPunch?: boolean;
}

const Scene: React.FC<SceneProps> = ({
  children,
  horizontalPunch = false,
  verticalPunch = false,
}) => {
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
        className={className({
          [styles.scene]: true,
          [styles.hpunch]: horizontalPunch,
          [styles.vpunch]: verticalPunch,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Scene;
