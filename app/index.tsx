import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomCandlestickChart from '@/components/CandlestickChart';
import OrderBook from '@/components/OrderBook';
import {
  generateInitialData,
  updateCurrentCandle,
  generateNewCandle,
  generateOrderBookData,
} from '@/utils/dummyData';
import { ThemedView } from '@/components/ThemedView';

export default function Trading() {
  const [chartData, setChartData] = useState(generateInitialData());
  const [orderBookData, setOrderBookData] = useState(
    generateOrderBookData(chartData[chartData.length - 1].close)
  );
  const router = useRouter();

  useEffect(() => {
    let candleCounter = 0;

    const interval = setInterval(() => {
      setChartData((prevData) => {
        if (prevData.length === 0) {
          return generateInitialData();
        }

        const updatedData = [...prevData];
        if (candleCounter < 9) {
          updatedData[updatedData.length - 1] = updateCurrentCandle(
            updatedData[updatedData.length - 1]
          );
          candleCounter++;
        } else {
          const lastCandle = updatedData[updatedData.length - 1];
          const newCandle = generateNewCandle(lastCandle);
          updatedData.push(newCandle);
          if (updatedData.length > 30) {
            updatedData.shift();
          }
          candleCounter = 0;
        }
        return updatedData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const lastPrice = chartData[chartData.length - 1].close;
      setOrderBookData(generateOrderBookData(lastPrice));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const lastCandle = chartData[chartData.length - 1];
  const currentPrice = lastCandle ? lastCandle.close.toFixed(2) : '0.00';
  const priceChange = lastCandle
    ? (lastCandle.close - lastCandle.open).toFixed(2)
    : '0.00';
  const priceChangePercentage = lastCandle
    ? (((lastCandle.close - lastCandle.open) / lastCandle.open) * 100).toFixed(
        2
      )
    : '0.00';

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case 'header':
        return (
          <ThemedView style={styles.header}>
            <Text style={styles.ticker}>BTC</Text>
            <Text style={styles.name}>Bitcoin</Text>
            <Text style={styles.currentPrice}>${currentPrice}</Text>
            <Text
              style={[
                styles.priceChange,
                { color: Number(priceChange) >= 0 ? 'green' : 'red' },
              ]}
            >
              ${priceChange} ({priceChangePercentage}%)
            </Text>
          </ThemedView>
        );
      case 'chart':
        return <CustomCandlestickChart data={chartData} />;
      case 'orderBook':
        return (
          <OrderBook bids={orderBookData.bids} asks={orderBookData.asks} />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={['header', 'chart', 'orderBook']}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        style={styles.flatList}
      />

      <ThemedView style={styles.tradeButtonContainer}>
        <TouchableOpacity style={styles.tradeButton}>
          <Text style={styles.tradeButtonText}>Trade</Text>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  ticker: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  lastClose: {
    fontSize: 16,
    color: 'gray',
  },
  priceChange: {
    fontSize: 18,
  },
  marketStats: {
    padding: 16,
  },
  marketStatsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  marketStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tradeButtonContainer: {
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  tradeButton: {
    backgroundColor: 'black',
    padding: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
});