import React, { useEffect, useState } from "react";
import className from "src/lib/className";
import styles from "./Dialog.module.scss";

export interface DialogProps {
  name: string | null;
  paddingLeft?: number;
  paddingRight?: number;
  look?: "dialog" | "paper";
  text: string;
}

const Dialog: React.FC<DialogProps> = ({
  name,
  paddingLeft = 0,
  paddingRight = 0,
  look = "dialog",
  text,
}) => {
  const [visibleText, setVisibleText] = useState(1);
  useEffect(() => setVisibleText(1), [text]);
  useEffect(() => {
    if (visibleText < text.length) {
      const timer = setTimeout(() => setVisibleText(curr => curr + 1), 10);
      return () => clearTimeout(timer);
    }
  }, [visibleText, text]);
  return (
    <div className={styles.container}>
      <div
        className={className({
          [styles.dialog]: look === "dialog",
          [styles.paper]: look === "paper",
        })}
      >
        {name && <div className={styles.name}>{name}</div>}
        <div
          style={{
            ...(paddingLeft && { paddingLeft }),
            ...(paddingRight && { paddingRight }),
          }}
        >
          {text.slice(0, visibleText)}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
