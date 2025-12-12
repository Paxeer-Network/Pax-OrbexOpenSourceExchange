// orderBook.js

// A helper function for consistent numeric rounding
const roundValue = (num, decimals = 8) => {
  return Number(num.toFixed(decimals));
};

// Ensure tickSize is a positive number to avoid division or rounding errors
const normalizeTickSize = (tickSize) => {
  if (typeof tickSize !== 'number' || tickSize <= 0 || isNaN(tickSize)) {
    return 0.01;
  }
  return tickSize;
};

// Aggregates data efficiently while maintaining precision
const aggregateData = (data, tickSize) => {
  const aggregatedMap = new Map();
  const normalizedTickSize = normalizeTickSize(tickSize);

  for (let i = 0; i < data.length; i++) {
    const [priceRaw, amountRaw] = data[i];
    const price = Number(priceRaw);
    const amount = Number(amountRaw);

    // If you want to display zero amounts, remove amount <= 0 check
    if (!isFinite(price) || !isFinite(amount) || price <= 0 || amount <= 0) {
      continue; // Skip invalid entries
    }

    const roundedPrice = roundValue(Math.floor(price / normalizedTickSize) * normalizedTickSize);
    const existing = aggregatedMap.get(roundedPrice);
    if (existing) {
      existing.amount = roundValue(existing.amount + amount);
      existing.total = roundValue(existing.total + (roundedPrice * amount));
    } else {
      aggregatedMap.set(roundedPrice, {
        price: roundedPrice,
        amount: roundValue(amount),
        total: roundValue(roundedPrice * amount),
      });
    }
  }

  return Array.from(aggregatedMap.values());
};

const processOrderBookData = (data, tickSize = 0.0001) => {
  if (!data || !Array.isArray(data.asks) || !Array.isArray(data.bids)) {
    postMessage({
      asks: [],
      bids: [],
      maxAskTotal: 0,
      maxBidTotal: 0,
      askPercentage: "0.00",
      bidPercentage: "0.00",
      bestPrices: { bestAsk: 0, bestBid: 0 },
    });
    return;
  }

  const normalizedTickSize = normalizeTickSize(tickSize);

  // Aggregate asks and bids WITHOUT slicing
  const aggregatedAsks = aggregateData(data.asks, normalizedTickSize)
    .sort((a, b) => a.price - b.price);

  const aggregatedBids = aggregateData(data.bids, normalizedTickSize)
    .sort((a, b) => b.price - a.price);

  let totalAskVolume = 0;
  let totalBidVolume = 0;
  let maxAskTotal = 0;
  let maxBidTotal = 0;
  let bestAsk = Infinity;
  let bestBid = -Infinity;

  for (let i = 0; i < aggregatedAsks.length; i++) {
    const ask = aggregatedAsks[i];
    totalAskVolume += ask.total;
    if (ask.total > maxAskTotal) maxAskTotal = ask.total;
    if (ask.price < bestAsk) bestAsk = ask.price;
  }

  for (let i = 0; i < aggregatedBids.length; i++) {
    const bid = aggregatedBids[i];
    totalBidVolume += bid.total;
    if (bid.total > maxBidTotal) maxBidTotal = bid.total;
    if (bid.price > bestBid) bestBid = bid.price;
  }

  const totalVolume = totalAskVolume + totalBidVolume;
  const askPercentage = totalVolume > 0 ? roundValue((totalAskVolume / totalVolume) * 100, 2).toFixed(2) : '0.00';
  const bidPercentage = totalVolume > 0 ? roundValue((totalBidVolume / totalVolume) * 100, 2).toFixed(2) : '0.00';

  if (!isFinite(bestAsk)) bestAsk = 0;
  if (!isFinite(bestBid)) bestBid = 0;

  postMessage({
    asks: aggregatedAsks,
    bids: aggregatedBids,
    maxAskTotal,
    maxBidTotal,
    askPercentage,
    bidPercentage,
    bestPrices: { bestAsk, bestBid },
  });
};

onmessage = (e) => {
  processOrderBookData(e.data);
};
