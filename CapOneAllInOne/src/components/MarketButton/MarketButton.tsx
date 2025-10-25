import React from "react";
import { Wallet } from "lucide-react";
import styles from "./MarketButton.module.css";

const InfoButton: React.FC = () => {
  const handleClick = () => {
    console.log("Info button clicked");
  };

  return (
    <button
      className={styles.infoButton}
      onClick={handleClick}
      aria-label="Portfolio information"
    >
      <Wallet size={24} />
    </button>
  );
};

export default InfoButton;
