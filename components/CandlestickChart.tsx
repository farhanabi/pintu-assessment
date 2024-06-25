import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { CandlestickChart } from 'react-native-wagmi-charts';

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
  const formattedData = data.map((candle) => ({
    timestamp: candle.timestamp,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }));

  return (
    <View style={styles.container}>
      <CandlestickChart.Provider data={formattedData}>
        <CandlestickChart height={screenHeight * 0.4} width={screenWidth - 20}>
          <CandlestickChart.Candles />
          <CandlestickChart.Crosshair>
            <CandlestickChart.Tooltip />
          </CandlestickChart.Crosshair>
        </CandlestickChart>
        <View style={styles.textContainer}>
          <CandlestickChart.PriceText type="open" />
          <CandlestickChart.PriceText type="high" />
          <CandlestickChart.PriceText type="low" />
          <CandlestickChart.PriceText type="close" />
        </View>
        <CandlestickChart.DatetimeText style={styles.dateText} />
      </CandlestickChart.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateText: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default CustomCandlestickChart;
