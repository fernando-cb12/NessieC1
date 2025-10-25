import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import styles from "./MarketItem.module.css";

interface MarketItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const MarketItem: React.FC<MarketItemProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
}) => {
  const isPositive = change >= 0;

  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatChange = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${formatPrice(value)}`;
  };

  const formatPercent = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className={styles.marketItem}>
      <div className={styles.iconContainer}>
        {isPositive ? (
          <TrendingUp size={20} className={styles.iconPositive} />
        ) : (
          <TrendingDown size={20} className={styles.iconNegative} />
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.symbol}>{symbol}</div>
        <div className={styles.name}>{name}</div>
      </div>

      <div className={styles.priceData}>
        <div className={styles.price}>{formatPrice(price)}</div>
        <div
          className={`${styles.change} ${
            isPositive ? styles.positive : styles.negative
          }`}
        >
          {formatChange(change)}
        </div>
        <div
          className={`${styles.percent} ${
            isPositive ? styles.positive : styles.negative
          }`}
        >
          {formatPercent(changePercent)}
        </div>
      </div>
    </div>
  );
};

export default MarketItem;
