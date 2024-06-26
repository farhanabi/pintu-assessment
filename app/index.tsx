import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  useColorScheme,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomCandlestickChart from '@/components/CandlestickChart';
import OrderBook from '@/components/OrderBook';
import { ThemedView, ThemedText } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import {
  createPriceWebSocket,
  fetchBitcoinCandlestickData,
} from '@/services/data';
import { generateOrderBookData } from '@/utils/dummyData';

export default function Trading() {
  const colorScheme = useColorScheme();
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
  const [selectedInterval, setSelectedInterval] = useState('24h');

  useEffect(() => {
    const ws = createPriceWebSocket(setBitcoinPrice);
    return () => ws.close();
  }, []);

  const {
    data: candlestickData,
    isLoading: isCandlestickDataLoading,
    error: candlestickDataError,
  } = useQuery({
    queryKey: ['candlestickData', selectedInterval],
    queryFn: () => fetchBitcoinCandlestickData(selectedInterval),
    refetchInterval: 1800000, // Refetch every 30 minutes
  });

  const orderBookData = useMemo(
    () =>
      bitcoinPrice
        ? generateOrderBookData(bitcoinPrice)
        : { bids: [], asks: [] },
    [bitcoinPrice]
  );

  useEffect(() => {
    if (candlestickDataError) {
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    }
  }, [candlestickDataError]);

  const isLoading = isCandlestickDataLoading || !bitcoinPrice;

  if (isLoading && !candlestickData) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  const renderIntervalButton = (interval: string) => (
    <TouchableOpacity
      key={interval}
      style={[
        styles.intervalButton,
        {
          borderColor:
            colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint,
        },
        selectedInterval === interval && {
          backgroundColor:
            colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint,
          borderColor:
            colorScheme === 'dark'
              ? Colors.dark.background
              : Colors.light.background,
        },
      ]}
      onPress={() => setSelectedInterval(interval)}
    >
      <ThemedText
        style={[
          styles.intervalButtonText,
          {
            color:
              colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
          },
          selectedInterval === interval && {
            color:
              colorScheme === 'dark' ? Colors.light.text : Colors.dark.text,
          },
        ]}
      >
        {interval}
      </ThemedText>
    </TouchableOpacity>
  );

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
                  $
                  {bitcoinPrice
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
      case 'intervalSelector':
        return (
          <View style={styles.intervalSelectorContainer}>
            {['24h', '7d', '30d', '3m', '1y'].map(renderIntervalButton)}
          </View>
        );
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
        data={['header', 'chart', 'intervalSelector', 'orderBook']}
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
  intervalSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  intervalButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  intervalButtonText: {
    fontSize: 14,
  },
  tradeButtonContainer: {
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
