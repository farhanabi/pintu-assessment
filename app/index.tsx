import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import CustomCandlestickChart from '@/components/CandlestickChart';
import OrderBook from '@/components/OrderBook';
import { generateOrderBookData } from '@/utils/dummyData';
import { ThemedView } from '@/components/ThemedView';
import {
  createPriceWebSocket,
  fetchBitcoinCandlestickData,
} from '@/services/data';
import { ThemedText } from '@/components/ThemedText';

export default function Trading() {
  const colorScheme = useColorScheme();
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = createPriceWebSocket((data) => {
      if (data) {
        setBitcoinPrice(data);
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  const {
    data: candlestickData,
    isLoading: isCandlestickDataLoading,
    error: candlestickDataError,
  } = useQuery({
    queryKey: ['candlestickData'],
    queryFn: fetchBitcoinCandlestickData,
    refetchInterval: 1800000, // Refetch every 30 minutes
  });

  const orderBookData = React.useMemo(() => {
    return bitcoinPrice
      ? generateOrderBookData(bitcoinPrice)
      : { bids: [], asks: [] };
  }, [bitcoinPrice]);

  if (candlestickDataError) {
    Alert.alert('Error', 'Failed to fetch data. Please try again later.');
  }

  const isLoading = isCandlestickDataLoading || !bitcoinPrice;

  if (isLoading && !candlestickData) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case 'header':
        return (
          <ThemedView style={styles.header}>
            {!bitcoinPrice ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <ThemedText style={styles.ticker}>BTC</ThemedText>
                <ThemedText style={styles.name}>Bitcoin</ThemedText>
                <ThemedText style={styles.currentPrice}>
                  ${bitcoinPrice.toFixed(2)}
                </ThemedText>
              </>
            )}
          </ThemedView>
        );
      case 'chart':
        return isCandlestickDataLoading ? (
          <ActivityIndicator size="large" />
        ) : candlestickData ? (
          <CustomCandlestickChart data={candlestickData} />
        ) : null;
      case 'orderBook':
        return !bitcoinPrice ? (
          <ActivityIndicator size="large" />
        ) : (
          <OrderBook bids={orderBookData.bids} asks={orderBookData.asks} />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff' },
      ]}
    >
      <FlatList
        data={['header', 'chart', 'orderBook']}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />

      <ThemedView style={styles.tradeButtonContainer}>
        <TouchableOpacity style={styles.tradeButton}>
          <ThemedText style={styles.tradeButtonText}>Trade</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  flatListContent: {
    paddingBottom: 16,
  },
});
