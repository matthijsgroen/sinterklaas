import React from "react";
import styles from "./DialogBox.module.scss";

interface DialogBoxProps {
  title: string;
  onClose: () => void;
}

const DialogBox: React.FC<DialogBoxProps> = ({ title, children, onClose }) => (
  <div className={styles.boxContainer}>
    <div className={styles.box}>
      <header>
        <h1>{title}</h1>
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          &times;
        </button>
      </header>
      <div>{children}</div>
    </div>
  </div>
);

export default DialogBox;
