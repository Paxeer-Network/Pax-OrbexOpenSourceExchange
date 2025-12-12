-- ScyllaDB keyspace and tables for high-performance trading data

CREATE KEYSPACE IF NOT EXISTS trading
WITH REPLICATION = {
  'class': 'SimpleStrategy',
  'replication_factor': 3
};

USE trading;

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  user_id UUID,
  symbol TEXT,
  side TEXT,
  type TEXT,
  amount DECIMAL,
  price DECIMAL,
  filled DECIMAL,
  remaining DECIMAL,
  cost DECIMAL,
  fee DECIMAL,
  status TEXT,
  trades TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_symbol_idx ON orders (symbol);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id);

CREATE TABLE IF NOT EXISTS order_book (
  symbol TEXT,
  side TEXT,
  price DECIMAL,
  amount DECIMAL,
  PRIMARY KEY (symbol, side, price)
) WITH CLUSTERING ORDER BY (side ASC, price DESC);

CREATE TABLE IF NOT EXISTS candles (
  symbol TEXT,
  interval TEXT,
  created_at TIMESTAMP,
  open DECIMAL,
  high DECIMAL,
  low DECIMAL,
  close DECIMAL,
  volume DECIMAL,
  updated_at TIMESTAMP,
  PRIMARY KEY (symbol, interval, created_at)
) WITH CLUSTERING ORDER BY (interval ASC, created_at DESC);

CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY,
  symbol TEXT,
  price DECIMAL,
  amount DECIMAL,
  cost DECIMAL,
  side TEXT,
  buyer_id UUID,
  seller_id UUID,
  created_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS trades_symbol_idx ON trades (symbol);
CREATE INDEX IF NOT EXISTS trades_created_idx ON trades (created_at);
