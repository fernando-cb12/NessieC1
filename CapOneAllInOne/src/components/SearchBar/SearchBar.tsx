import React from "react";
import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search..." }) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIcon}>
        <Search size={20} />
      </div>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;
