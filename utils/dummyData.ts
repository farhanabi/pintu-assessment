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

function updateCurrentCandle(currentCandle: CandlestickData): CandlestickData {
  const newClose = currentCandle.close + (Math.random() - 0.5) * 1; // Small random price change
  const newHigh = Math.max(currentCandle.high, newClose);
  const newLow = Math.min(currentCandle.low, newClose);

  return {
    ...currentCandle,
    high: newHigh,
    low: newLow,
    close: newClose,
  };
}

function generateNewCandle(lastCandle: CandlestickData): CandlestickData {
  const open = lastCandle.close;
  const close = open + (Math.random() - 0.5) * 5;
  const high = Math.max(open, close) + Math.random() * 2;
  const low = Math.min(open, close) - Math.random() * 2;

  return {
    timestamp: Date.now(),
    open,
    high,
    low,
    close,
  };
}

export { generateInitialData, updateCurrentCandle, generateNewCandle };
