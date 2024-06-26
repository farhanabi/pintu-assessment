import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

const OrderBookItem: React.FC<{
  bid: OrderBookEntry | null;
  ask: OrderBookEntry | null;
  maxBidTotal: number;
  maxAskTotal: number;
}> = ({ bid, ask, maxBidTotal, maxAskTotal }) => (
  <View style={styles.row}>
    <View style={styles.bidBackground}>
      <View
        style={[
          styles.bidFill,
          { width: bid ? `${(bid.total / maxBidTotal) * 100}%` : '0%' },
        ]}
      />
    </View>
    <ThemedText style={[styles.orderBookText, styles.bidText]}>
      {bid ? bid.amount.toFixed(4) : '-'}
    </ThemedText>
    <ThemedText style={[styles.orderBookText, styles.bidText]}>
      {bid ? bid.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}
    </ThemedText>
    <ThemedText style={[styles.orderBookText, styles.askText]}>
      {ask ? ask.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}
    </ThemedText>
    <ThemedText style={[styles.orderBookText, styles.askText]}>
      {ask ? ask.amount.toFixed(4) : '-'}
    </ThemedText>
    <View style={styles.askBackground}>
      <View
        style={[
          styles.askFill,
          { width: ask ? `${(ask.total / maxAskTotal) * 100}%` : '0%' },
        ]}
      />
    </View>
  </View>
);

const OrderBook: React.FC<OrderBookProps> = ({ bids, asks }) => {
  const maxBidTotal = useMemo(
    () => Math.max(...bids.map((bid) => bid.total)),
    [bids]
  );
  const maxAskTotal = useMemo(
    () => Math.max(...asks.map((ask) => ask.total)),
    [asks]
  );

  const totalVolume = maxBidTotal + maxAskTotal;
  const bidPercentage = (maxBidTotal / totalVolume) * 100;
  const askPercentage = (maxAskTotal / totalVolume) * 100;

  const renderItem = ({
    item,
    index,
  }: {
    item: OrderBookEntry | null;
    index: number;
  }) => (
    <OrderBookItem
      bid={bids[index]}
      ask={asks[index]}
      maxBidTotal={maxBidTotal}
      maxAskTotal={maxAskTotal}
    />
  );

  const data = Array(Math.max(bids.length, asks.length)).fill(null);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Order Book</ThemedText>
      <View style={styles.percentageLine}>
        <View style={[styles.bidPercentage, { width: `${bidPercentage}%` }]} />
        <View style={[styles.askPercentage, { width: `${askPercentage}%` }]} />
      </View>
      <View style={styles.percentageLabels}>
        <ThemedText style={[styles.percentageLabel, styles.bidText]}>
          {bidPercentage.toFixed(1)}%
        </ThemedText>
        <ThemedText style={[styles.percentageLabel, styles.askText]}>
          {askPercentage.toFixed(1)}%
        </ThemedText>
      </View>
      <View style={styles.header}>
        <ThemedText style={[styles.headerText, styles.bidText]}>
          Amount
        </ThemedText>
        <ThemedText style={[styles.headerText, styles.bidText]}>
          Bid Price
        </ThemedText>
        <ThemedText style={[styles.headerText, styles.askText]}>
          Ask Price
        </ThemedText>
        <ThemedText style={[styles.headerText, styles.askText]}>
          Amount
        </ThemedText>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `order-${index}`}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
    gap: 16,
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 16,
    alignItems: 'center',
  },
  orderBookText: {
    flex: 1,
  },
  bidText: {
    color: 'green',
    textAlign: 'right',
  },
  askText: {
    color: 'red',
    textAlign: 'left',
  },
  bidBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },
  askBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },
  bidFill: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    height: '100%',
    alignSelf: 'flex-end',
  },
  askFill: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    height: '100%',
  },
  percentageLine: {
    flexDirection: 'row',
    height: 4,
    marginBottom: 4,
  },
  bidPercentage: {
    backgroundColor: 'rgba(0, 255, 0, 0.5)',
    height: '100%',
  },
  askPercentage: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    height: '100%',
  },
  percentageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  percentageLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OrderBook;
