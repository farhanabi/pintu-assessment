import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

const axiosInstance = axios.create({
  baseURL: COINGECKO_API_URL,
  headers: {
    'x-cg-demo-api-key': process.env.EXPO_PUBLIC_COINGECKO_API_KEY,
  },
});

export function createPriceWebSocket(onPriceUpdate: (price: number) => void) {
  const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.bitcoin) {
      onPriceUpdate(parseFloat(data.bitcoin));
    }
  };

  return ws;
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
