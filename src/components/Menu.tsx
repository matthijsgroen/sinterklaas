import React from "react";
import styles from "./Menu.module.scss";

export interface MenuProps {
  options: string[];
  onClick(selected: number): void;
}

const Menu: React.FC<MenuProps> = ({ options, onClick }) => (
  <div className={styles.dimmed}>
    <div>
      {options.map((label, index) => (
        <button
          key={index}
          className={styles.button}
          onClick={() => onClick(index)}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default Menu;
