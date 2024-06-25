interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

function generateInitialData(numCandles: number = 30): CandlestickData[] {
  const data: CandlestickData[] = [];
  let lastClose = 100; // Starting price

  for (let i = 0; i < numCandles; i++) {
    const timestamp = Date.now() - (numCandles - i) * 10000; // Each candle represents 10 seconds
    const open = lastClose;
    const close = open + (Math.random() - 0.5) * 5; // Random price change
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;

    data.push({
      timestamp,
      open,
      high,
      low,
      close,
    });

    lastClose = close;
  }

  return data;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

function generateOrderBookData(lastPrice: number): OrderBookData {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];

  const bidPriceStep = lastPrice * 0.0001; // 0.01% step
  const askPriceStep = lastPrice * 0.0001; // 0.01% step

  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < 20; i++) {
    const bidPrice = lastPrice - i * bidPriceStep;
    const askPrice = lastPrice + i * askPriceStep;

    // Generate more realistic amounts
    const bidAmount = Math.random() * 5 + 0.1; // Random amount between 0.1 and 5.1
    const askAmount = Math.random() * 5 + 0.1; // Random amount between 0.1 and 5.1

    bidTotal += bidAmount;
    askTotal += askAmount;

    bids.push({
      price: Number(bidPrice.toFixed(2)),
      amount: Number(bidAmount.toFixed(4)),
      total: Number(bidTotal.toFixed(4)),
    });

    asks.push({
      price: Number(askPrice.toFixed(2)),
      amount: Number(askAmount.toFixed(4)),
      total: Number(askTotal.toFixed(4)),
    });
  }

  // Sort bids in descending order and asks in ascending order
  bids.sort((a, b) => b.price - a.price);
  asks.sort((a, b) => a.price - b.price);

  return { bids, asks };
}

export { generateInitialData, generateOrderBookData };
