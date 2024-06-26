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

export async function fetchBitcoinCandlestickData(interval: string) {
  try {
    let days;
    switch (interval) {
      case '24h':
        days = 1;
        break;
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '3m':
        days = 90;
        break;
      case '6m':
        days = 180;
        break;
      default:
        days = 1;
    }

    const response = await axiosInstance.get('/coins/bitcoin/ohlc', {
      params: {
        vs_currency: 'usd',
        days,
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
