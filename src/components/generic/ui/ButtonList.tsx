import React from "react";
import styles from "./ButtonList.module.scss";

interface ButtonListProps {
  buttons: {
    name: string;
    onClick(): void;
  }[];
}

export const ButtonList: React.FC<ButtonListProps> = ({ buttons }) => (
  <ul className={styles.list}>
    {buttons.map(({ name, onClick }, index) => (
      <li key={index}>
        <button onClick={onClick}>{name}</button>
      </li>
    ))}
  </ul>
);
