import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

const axiosInstance = axios.create({
  baseURL: COINGECKO_API_URL,
  headers: {
    'x-cg-demo-api-key': process.env.EXPO_PUBLIC_COINGECKO_API_KEY,
  },
});
export async function fetchBitcoinData() {
  try {
    const response = await axiosInstance.get('/coins/bitcoin', {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });

    const { market_data } = response.data;

    return {
      currentPrice: market_data.current_price.usd,
      priceChange24h: market_data.price_change_24h,
      priceChangePercentage24h: market_data.price_change_percentage_24h,
      high24h: market_data.high_24h.usd,
      low24h: market_data.low_24h.usd,
    };
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    return null;
  }
}

export async function fetchBitcoinCandlestickData() {
  try {
    const response = await axiosInstance.get('/coins/bitcoin/ohlc', {
      params: {
        vs_currency: 'usd',
        days: 1,
      },
    });

    return response.data.map((candle: number[]) => ({
      timestamp: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
    }));
  } catch (error) {
    console.error('Error fetching Bitcoin candlestick data:', error);
    return null;
  }
}
