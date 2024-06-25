import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import CustomCandlestickChart from '@/components/CandlestickChart';
import OrderBook from '@/components/OrderBook';
import { generateOrderBookData } from '@/utils/dummyData';
import { ThemedView } from '@/components/ThemedView';
import {
  fetchBitcoinCandlestickData,
  fetchBitcoinData,
} from '@/services/coingecko';

export default function Trading() {
  const {
    data: bitcoinData,
    isLoading: isBitcoinDataLoading,
    error: bitcoinDataError,
  } = useQuery({
    queryKey: ['bitcoinData'],
    queryFn: fetchBitcoinData,
    refetchInterval: 20000, // Refetch every 20 seconds
  });

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
    return bitcoinData
      ? generateOrderBookData(bitcoinData.currentPrice)
      : { bids: [], asks: [] };
  }, [bitcoinData]);

  if (bitcoinDataError || candlestickDataError) {
    Alert.alert('Error', 'Failed to fetch data. Please try again later.');
  }

  const isLoading = isBitcoinDataLoading || isCandlestickDataLoading;

  if (isLoading && (!bitcoinData || !candlestickData)) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case 'header':
        return (
          <ThemedView style={styles.header}>
            {isBitcoinDataLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <Text style={styles.ticker}>BTC</Text>
                <Text style={styles.name}>Bitcoin</Text>
                <Text style={styles.currentPrice}>
                  ${bitcoinData?.currentPrice.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.priceChange,
                    {
                      color: bitcoinData?.priceChange24h >= 0 ? 'green' : 'red',
                    },
                  ]}
                >
                  ${bitcoinData?.priceChange24h.toFixed(2)} (
                  {bitcoinData?.priceChangePercentage24h.toFixed(2)}%)
                </Text>
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
        return isBitcoinDataLoading ? (
          <ActivityIndicator size="large" />
        ) : (
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
        contentContainerStyle={styles.flatListContent}
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
  flatListContent: {
    paddingBottom: 16,
  },
});
