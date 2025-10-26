import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import MarketItem from "../../components/MarketItem/MarketItem";
import InfoButton from "../../components/MarketButton/MarketButton";
import styles from "./Stocks.module.css";
import type { MarketData } from "../../types";
import { fetchMarketData } from "../../api/Stocks";
import FinanceAgent from "../../components/FinanceAgent/FinanceAgent";

const Stocks: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMarketData();
      setMarketData(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  // Split data into USA and Crypto markets
  const usaMarket = marketData.slice(0, 6);
  const cryptoMarket = marketData.slice(6);

  if (loading) {
    return (
      <div className={styles.stocksContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stocksContainer}>
        <div className={styles.errorMessage}>
          <p>Error loading market data</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stocksContainer}>
      {/* USA Market Section */}
      <FinanceAgent route="stocks" />
      {/* Search Bar */}
      <SearchBar placeholder="Search stocks..." />
      <section className={styles.marketSection}>
        <h2 className={styles.marketTitle}>Market: USA</h2>
        <div className={styles.marketGrid}>
          <div className={styles.gridHeader}>
            <span></span>
            <span>Price</span>
            <span>Change</span>
            <span>% Chg</span>
          </div>
          {usaMarket.map((item) => (
            <MarketItem
              key={item.symbol}
              symbol={item.symbol}
              name={item.name}
              price={item.price}
              change={item.change}
              changePercent={item.changePercent}
            />
          ))}
        </div>
      </section>

      {/* Crypto Market Section */}
      <section className={styles.marketSection}>
        <h2 className={styles.marketTitle}>Market: Cripto</h2>
        <div className={styles.marketGrid}>
          <div className={styles.gridHeader}>
            <span></span>
            <span>Price</span>
            <span>Change</span>
            <span>% Chg</span>
          </div>
          {cryptoMarket.map((item) => (
            <MarketItem
              key={item.symbol}
              symbol={item.symbol}
              name={item.name}
              price={item.price}
              change={item.change}
              changePercent={item.changePercent}
            />
          ))}
        </div>
      </section>

      {/* Info Button */}
      <InfoButton />
    </div>
  );
};

export default Stocks;
