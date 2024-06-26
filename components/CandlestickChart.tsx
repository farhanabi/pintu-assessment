import React, { useMemo } from 'react';
import { StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { CandlestickChart } from 'react-native-wagmi-charts';
import { ThemedView } from './ThemedView';
import Svg, { Line, Text } from 'react-native-svg';

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
const CHART_HEIGHT = screenHeight * 0.4;
const CHART_WIDTH = screenWidth - 20;
const PRICE_LABEL_WIDTH = 50;
const DATE_LABEL_HEIGHT = 20;

const CustomCandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const colorScheme = useColorScheme();
  const formattedData = data.map((candle) => ({
    timestamp: candle.timestamp,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }));

  const gridColor =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textColor =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

  const { minPrice, maxPrice } = useMemo(() => {
    const prices = formattedData.flatMap((d) => [d.low, d.high]);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [formattedData]);

  const renderGrid = () => {
    const horizontalLines = 5;
    const gridElements = [];

    // Horizontal lines and price labels
    for (let i = 0; i <= horizontalLines; i++) {
      const y = (i / horizontalLines) * CHART_HEIGHT;
      const price = maxPrice - (i / horizontalLines) * (maxPrice - minPrice);
      gridElements.push(
        <Line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={CHART_WIDTH - PRICE_LABEL_WIDTH}
          y2={y}
          stroke={gridColor}
          strokeWidth="1"
        />
      );
      gridElements.push(
        <Text
          key={`h-text-${i}`}
          x={CHART_WIDTH}
          y={y}
          fontSize="10"
          fill={textColor}
          textAnchor="end"
          alignmentBaseline="middle"
        >
          {price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Text>
      );
    }

    return gridElements;
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff' },
      ]}
    >
      <CandlestickChart.Provider data={formattedData}>
        <CandlestickChart height={CHART_HEIGHT} width={CHART_WIDTH}>
          <Svg
            height={CHART_HEIGHT + DATE_LABEL_HEIGHT}
            width={CHART_WIDTH}
            style={StyleSheet.absoluteFill}
          >
            {renderGrid()}
          </Svg>
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
