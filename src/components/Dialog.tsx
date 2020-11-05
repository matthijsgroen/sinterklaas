import React, { useEffect, useState } from "react";
import styles from "./Dialog.module.scss";

export interface DialogProps {
  name: string | null;
  paddingLeft?: number;
  paddingRight?: number;
  text: string;
}

const Dialog: React.FC<DialogProps> = ({
  name,
  paddingLeft = 0,
  paddingRight = 0,
  text,
}) => {
  const [visibleText, setVisibleText] = useState(1);
  useEffect(() => setVisibleText(1), [text]);
  useEffect(() => {
    if (visibleText < text.length) {
      setTimeout(() => setVisibleText((curr) => curr + 1), 25);
    }
  }, [visibleText, text]);
  return (
    <div className={styles.container}>
      <div className={styles.dialog}>
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
