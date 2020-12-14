import React from "react";
import styles from "./OptionList.module.scss";

interface OptionListProps {
  options: {
    name: string;
    onClick(): void;
  }[];
}

export const OptionList: React.FC<OptionListProps> = ({ options }) => (
  <ul className={styles.list}>
    {options.map(({ name, onClick }, index) => (
      <li key={index}>
        <button onClick={onClick}>{name}</button>
      </li>
    ))}
  </ul>
);
