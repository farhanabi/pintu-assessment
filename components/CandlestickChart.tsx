import React from 'react';
import { StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { CandlestickChart } from 'react-native-wagmi-charts';
import { ThemedView } from './ThemedView';

interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CustomCandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const colorScheme = useColorScheme();
  const formattedData = data.map((candle) => ({
    timestamp: candle.timestamp,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }));

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff' },
      ]}
    >
      <CandlestickChart.Provider data={formattedData}>
        <CandlestickChart height={screenHeight * 0.4} width={screenWidth - 20}>
          <CandlestickChart.Candles />
          <CandlestickChart.Crosshair>
            <CandlestickChart.Tooltip />
          </CandlestickChart.Crosshair>
        </CandlestickChart>
        <ThemedView style={styles.textContainer}>
          <CandlestickChart.PriceText
            type="open"
            style={[
              styles.priceText,
              {
                color: colorScheme === 'dark' ? '#9BA1A6' : 'black',
              },
            ]}
          />
          <CandlestickChart.PriceText
            type="high"
            style={[
              styles.priceText,
              {
                color: colorScheme === 'dark' ? '#9BA1A6' : 'black',
              },
            ]}
          />
          <CandlestickChart.PriceText
            type="low"
            style={[
              styles.priceText,
              {
                color: colorScheme === 'dark' ? '#9BA1A6' : 'black',
              },
            ]}
          />
          <CandlestickChart.PriceText
            type="close"
            style={[
              styles.priceText,
              {
                color: colorScheme === 'dark' ? '#9BA1A6' : 'black',
              },
            ]}
          />
        </ThemedView>
        <CandlestickChart.DatetimeText
          style={[
            styles.dateText,
            {
              color: colorScheme === 'dark' ? 'white' : 'black',
            },
          ]}
        />
      </CandlestickChart.Provider>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default CustomCandlestickChart;
