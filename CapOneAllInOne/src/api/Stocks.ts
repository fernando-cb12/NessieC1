import type { StockPosition, MarketData } from "../types";

/**
 * Alpaca API Configuration
 * IMPORTANTE: Reemplaza con tus credenciales de Paper Trading
 */
const ALPACA_API_KEY = "PK6SIPNHSOLYKUGG2JJXE7ZHIM";
const ALPACA_SECRET_KEY = "Dxqwc9onbF9ErydYg9RaKVGnBCRyiBGkPUhscs9XnW3q"; // Nota: Esta key se cortó en la imagen
const ALPACA_BASE_URL = "https://paper-api.alpaca.markets"; // Paper trading soporta CORS

/**
 * Fetches all stock positions from Alpaca
 * @returns Promise<StockPosition[]>
 */
export const fetchStockPositions = async (): Promise<StockPosition[]> => {
  try {
    const response = await fetch(`${ALPACA_BASE_URL}/v2/positions`, {
      method: "GET",
      headers: {
        "APCA-API-KEY-ID": ALPACA_API_KEY,
        "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching positions:", errorText);
      throw new Error(`Failed to fetch stock positions: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchStockPositions:", error);
    throw error;
  }
};

/**
 * Fetches account information from Alpaca
 * @returns Promise<any>
 */
export const fetchAlpacaAccount = async (): Promise<any> => {
  try {
    const response = await fetch(`${ALPACA_BASE_URL}/v2/account`, {
      method: "GET",
      headers: {
        "APCA-API-KEY-ID": ALPACA_API_KEY,
        "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching account:", errorText);
      throw new Error(`Failed to fetch account: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchAlpacaAccount:", error);
    throw error;
  }
};

/**
 * Fetches latest quote for a specific stock
 * Nota: Para datos de mercado necesitas usar data.alpaca.markets
 * que puede tener restricciones de CORS
 * @param symbol - Stock symbol (e.g., "AAPL")
 * @returns Promise<any>
 */
export const fetchStockQuote = async (symbol: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`,
      {
        method: "GET",
        headers: {
          "APCA-API-KEY-ID": ALPACA_API_KEY,
          "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch quote for ${symbol}: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetches market data for popular stocks
 * NOTA: Para hackathon, usa mock data o llama a la API desde un backend
 * Los datos de mercado históricos/en tiempo real pueden tener limitaciones CORS
 * @returns Promise<MarketData[]>
 */
export const fetchMarketData = async (): Promise<MarketData[]> => {
  // Para el hackathon, usa mock data
  // Si quieres datos reales, necesitarías un backend proxy

  const mockData: MarketData[] = [
    // USA Market
    {
      symbol: "Dow",
      name: "Dow Jones",
      price: 47207.12,
      change: 472.51,
      changePercent: 1.01,
      isPositive: true,
    },
    {
      symbol: "S&P 500",
      name: "S&P 500",
      price: 4791.69,
      change: -63.32,
      changePercent: -0.79,
      isPositive: false,
    },
    {
      symbol: "Nasdaq",
      name: "Nasdaq",
      price: 23201.87,
      change: 263.07,
      changePercent: 1.15,
      isPositive: true,
    },
    {
      symbol: "VIX",
      name: "Volatility Index",
      price: 16.37,
      change: -0.93,
      changePercent: -5.38,
      isPositive: false,
    },
    {
      symbol: "Gold",
      name: "Gold Futures",
      price: 4126.6,
      change: 19.0,
      changePercent: 0.46,
      isPositive: true,
    },
    {
      symbol: "Oil",
      name: "Crude Oil",
      price: 61.44,
      change: -0.35,
      changePercent: -0.57,
      isPositive: false,
    },
    // Crypto Market
    {
      symbol: "Bitcoin USD",
      name: "BTC/USD",
      price: 111799,
      change: 1185,
      changePercent: 1.07,
      isPositive: true,
    },
    {
      symbol: "Ethereum USD",
      name: "ETH/USD",
      price: 3952.72,
      change: 15.19,
      changePercent: 0.39,
      isPositive: true,
    },
    {
      symbol: "XRP USD",
      name: "XRP/USD",
      price: 2.5461,
      change: 0.0336,
      changePercent: 1.34,
      isPositive: true,
    },
    {
      symbol: "Solana USD",
      name: "SOL/USD",
      price: 194.9,
      change: -1.43,
      changePercent: -0.73,
      isPositive: false,
    },
  ];

  return Promise.resolve(mockData);
};
