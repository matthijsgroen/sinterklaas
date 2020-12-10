import React from "react";
import styles from "./Scene.module.scss";
import className from "src/lib/className";
import ScreenScale from "./ScreenScale";

export interface SceneProps {
  horizontalPunch?: boolean;
  verticalPunch?: boolean;
}

const Scene: React.FC<SceneProps> = ({
  children,
  horizontalPunch = false,
  verticalPunch = false,
}) => (
  <ScreenScale
    className={className({
      [styles.hpunch]: horizontalPunch,
      [styles.vpunch]: verticalPunch,
    })}
  >
    {children}
  </ScreenScale>
);

export default Scene;
