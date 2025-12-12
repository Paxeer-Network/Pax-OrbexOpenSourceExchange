// Set environment variables BEFORE importing the service
process.env.NEXT_PUBLIC_BINARY_PROFIT = "87";
process.env.NEXT_PUBLIC_BINARY_HIGHER_LOWER_PROFIT = "87";
process.env.NEXT_PUBLIC_BINARY_TOUCH_NO_TOUCH_PROFIT = "87";
process.env.NEXT_PUBLIC_BINARY_CALL_PUT_PROFIT = "87";
process.env.NEXT_PUBLIC_BINARY_TURBO_PROFIT = "87";

import {
  ensureExchange,
  ensureNotBanned,
  getBinaryOrder,
  getBinaryOrdersByStatus,
} from "../utils";
import { BinaryOrderService } from "./BinaryOrderService";
import { sequelize, models } from "@b/db";

jest.mock("../utils", () => ({
  ensureExchange: jest.fn(),
  getBinaryOrder: jest.fn(),
  getBinaryOrdersByStatus: jest.fn(),
  validateBinaryProfit: jest.fn().mockReturnValue(87),
  ensureNotBanned: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@b/utils/exchange", () => ({
  __esModule: true,
  default: {
    startExchange: jest.fn(),
  },
}));

jest.mock("@b/utils/emails", () => ({
  sendBinaryOrderEmail: jest.fn(),
}));

jest.mock("@b/utils/notifications", () => ({
  handleNotification: jest.fn(),
}));

jest.mock("@b/handler/Websocket", () => ({
  sendMessageToRoute: jest.fn(),
}));

jest.mock("@b/db", () => {
  const transactionMock = jest.fn();
  return {
    sequelize: {
      transaction: transactionMock,
      LOCK: {
        UPDATE: "UPDATE",
      },
    },
    models: {
      exchangeMarket: { findOne: jest.fn() },
      wallet: { findOne: jest.fn(), update: jest.fn() },
      binaryOrder: {
        create: jest.fn(),
        update: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
      user: { findOne: jest.fn() },
      transaction: {
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        findOne: jest.fn(),
      },
    },
  };
});

const INITIAL_WALLET_BALANCE = 1000;
const mockUserId = "user123";
const mockCurrency = "BTC";
const mockPair = "USDT";
const mockBinaryProfit = 87;

let wallets: Record<string, any> = {};
let orders: Record<string, any> = {};
let transactions: Record<string, any> = {};

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.clearAllMocks();
  (sequelize.transaction as jest.Mock).mockImplementation(async (cb) => {
    const fakeTransaction = { LOCK: { UPDATE: "UPDATE" } };
    return cb(fakeTransaction);
  });

  models.exchangeMarket.findOne.mockResolvedValue({
    metadata: { limits: { amount: { min: 10, max: 10000 } } },
  });

  models.wallet.findOne.mockImplementation(async ({ where }) => {
    if (where.id && wallets[where.id]) {
      return { id: where.id, balance: wallets[where.id].balance };
    }
    if (
      where.userId === mockUserId &&
      where.currency === mockPair &&
      where.type === "SPOT"
    ) {
      const w = Object.values(wallets).find(
        (w) =>
          w.userId === mockUserId &&
          w.currency === mockPair &&
          w.type === "SPOT"
      );
      if (w) return { id: w.id, balance: w.balance };
    }
    return null;
  });

  models.wallet.update.mockImplementation(async (data, { where }) => {
    if (where.id && wallets[where.id]) {
      wallets[where.id].balance = data.balance;
    }
  });

  models.binaryOrder.create.mockImplementation(async (data) => {
    const orderId = "order_" + Math.random().toString(36).substring(2);
    const order = {
      ...data,
      id: orderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    orders[orderId] = order;
    return order;
  });

  models.binaryOrder.findOne.mockImplementation(
    async ({ where }) => orders[where.id] || null
  );
  models.binaryOrder.findAll.mockImplementation(async () =>
    Object.values(orders)
  );
  models.binaryOrder.update.mockImplementation(
    async (updateData, { where }) => {
      if (orders[where.id]) {
        orders[where.id] = { ...orders[where.id], ...updateData };
      }
    }
  );

  models.user.findOne.mockResolvedValue({ id: mockUserId });

  models.transaction.create.mockImplementation(async (data) => {
    const tid = "tx_" + Math.random().toString(36).substring(2);
    transactions[tid] = data;
    return { ...data, id: tid };
  });

  models.transaction.findOne.mockImplementation(async ({ where }) => {
    const referenceId = where.referenceId;
    for (const [tid, tx] of Object.entries(transactions)) {
      if (tx.referenceId === referenceId) return { ...tx, id: tid };
    }
    return null;
  });

  models.transaction.update.mockResolvedValue([1]);
  models.transaction.destroy.mockResolvedValue(1);

  wallets = {};
  orders = {};
  transactions = {};

  (getBinaryOrder as jest.Mock).mockImplementation(async (_uid, oid) =>
    models.binaryOrder.findOne({ where: { id: oid } })
  );
  (getBinaryOrdersByStatus as jest.Mock).mockImplementation(async (status) => {
    const all = await models.binaryOrder.findAll();
    return all.filter((o: any) => o.status === status);
  });
});

afterAll(() => {
  jest.useRealTimers();
});

function createTestWallet(balance = INITIAL_WALLET_BALANCE) {
  const walletId = "wallet_" + Math.random().toString(36).substring(2);
  wallets[walletId] = {
    id: walletId,
    balance,
    userId: mockUserId,
    currency: mockPair,
    type: "SPOT",
  };
  return walletId;
}

function getFutureClosedAt(ms = 60_000) {
  return new Date(Date.now() + ms).toISOString();
}

describe("Binary Order Service Comprehensive Tests (with OHLCV)", () => {
  test("RISE_FALL: Create & WIN scenario", async () => {
    const walletId = createTestWallet();
    const initialBalance = wallets[walletId].balance;
    const amount = 100;

    // First call to ensureExchange (createOrder) returns price=20000
    // Second call to ensureExchange (processOrder) returns price=20001
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20001 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 20001],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "RISE",
      type: "RISE_FALL",
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // Expect WIN: initial + 87 profit = 1087
    expect(wallets[walletId].balance).toBe(
      initialBalance + amount * (mockBinaryProfit / 100)
    );
  });

  test("RISE_FALL: LOSS scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    // CreateOrder: price=20000
    // ProcessOrder: price=19999 (LOSS)
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 19999 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 19999],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "RISE",
      type: "RISE_FALL",
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // LOSS=initial-100=900
    expect(wallets[walletId].balance).toBe(initialBalance - amount);
  });

  test("RISE_FALL: DRAW scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    // Draw scenario: price=20000 at creation and close=20000 at processing
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 20000],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "RISE",
      type: "RISE_FALL",
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // DRAW=initial=1000
    expect(wallets[walletId].balance).toBe(initialBalance);
  });

  test("HIGHER_LOWER: HIGHER WIN scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    // WIN scenario: barrier=19950 closePrice=20010>19950
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20010 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 20010],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "HIGHER",
      type: "HIGHER_LOWER",
      barrier: 19950,
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );

    expect(wallets[walletId].balance).toBe(
      initialBalance + amount * (mockBinaryProfit / 100)
    );
  });

  test("HIGHER_LOWER: LOWER LOSS scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    // LOWER LOSS scenario: barrier=20050 closePrice=20100>20050 => LOSS
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20100 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 20100],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "LOWER",
      type: "HIGHER_LOWER",
      barrier: 20050,
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });
    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );

    expect(wallets[walletId].balance).toBe(initialBalance - amount);
  });

  test("HIGHER_LOWER: DRAW scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    // DRAW scenario: closePrice=barrier=20000
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 20000],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "HIGHER",
      type: "HIGHER_LOWER",
      barrier: 20000,
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    expect(wallets[walletId].balance).toBe(initialBalance);
  });

  test("TOUCH_NO_TOUCH: TOUCH WIN scenario (barrier touched)", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;
    const now = Date.now();

    // TOUCH win scenario: barrier=20000 touched by OHLCV high>=20000
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20050 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [now, 0, 20100, 19900, 20000],
          [now + 60000, 0, 20100, 19900, 20050],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "TOUCH",
      type: "TOUCH_NO_TOUCH",
      barrier: 20000,
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    expect(wallets[walletId].balance).toBe(
      initialBalance + amount * (mockBinaryProfit / 100)
    );
  });

  test("TOUCH_NO_TOUCH: NO_TOUCH WIN scenario (barrier never touched)", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;
    const now = Date.now();

    // NO_TOUCH win: barrier=21000 never touched (high=20500<21000)
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [now, 0, 20500, 19500, 20000],
          [now + 60000, 0, 20500, 19500, 20000],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "NO_TOUCH",
      type: "TOUCH_NO_TOUCH",
      barrier: 21000,
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });
    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // WIN=1087
    expect(wallets[walletId].balance).toBe(
      initialBalance + amount * (mockBinaryProfit / 100)
    );
  });

  test("TOUCH_NO_TOUCH: LOSS scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;
    const now = Date.now();

    // LOSS scenario: NO_TOUCH but barrier=20000 touched
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [now, 0, 20100, 19900, 20000],
          [now + 60000, 0, 20100, 19900, 20000],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "NO_TOUCH",
      type: "TOUCH_NO_TOUCH",
      barrier: 20000,
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });
    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // LOSS=900
    expect(wallets[walletId].balance).toBe(initialBalance - amount);
  });

  test("CALL_PUT: CALL WIN scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;
    const strikePrice = 20000;

    // CALL WIN scenario: closePrice=20150>20000
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20150 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 20150],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "CALL",
      type: "CALL_PUT",
      strikePrice,
      payoutPerPoint: 1,
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // WIN=1087
    expect(wallets[walletId].balance).toBe(
      initialBalance + amount * (mockBinaryProfit / 100)
    );
  });

  test("CALL_PUT: PUT LOSS scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;
    const strikePrice = 20000;

    // PUT LOSS scenario: closePrice=20010>strikePrice(20000)
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20010 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 20010],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "PUT",
      type: "CALL_PUT",
      strikePrice,
      payoutPerPoint: 1,
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // LOSS=900
    expect(wallets[walletId].balance).toBe(initialBalance - amount);
  });

  test("TURBO: UP WIN scenario (no breach)", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    // At creation: price=20000
    // At processing: price=20150
    // Ensure no breach: For UP, ensure low≥barrier(20000). Let's pick low=20000 exactly.
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        // No barrier breach needed at creation time, so empty is fine.
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20150 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          // timestamp, open, high, low, close
          // Ensure low >= 20000
          [Date.now(), 20000, 20050, 20000, 20050],
          [Date.now() + 60000, 20050, 20150, 20050, 20150],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "UP",
      type: "TURBO",
      barrier: 20000,
      payoutPerPoint: 1,
      durationType: "TIME",
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // final=initial+50=1050
    expect(wallets[walletId].balance).toBe(initialBalance + 50);
  });

  test("TURBO: Adjusting scenario to ensure WIN", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20200 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [Date.now(), 20000, 20200, 20000, 20200],
          [Date.now() + 60000, 20200, 20200, 20200, 20200],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "UP",
      type: "TURBO",
      barrier: 20000,
      payoutPerPoint: 5,
      durationType: "TIME",
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // final=1900
    expect(wallets[walletId].balance).toBe(initialBalance + 900);
  });

  test("TURBO: LOSS scenario (turbo barrier breached)", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    // LOSS scenario: side=DOWN barrier=20000 closePrice=20100≥barrier no profit
    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20100 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [0, 0, 0, 0, 20000],
          [0, 0, 0, 0, 20100],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "DOWN",
      type: "TURBO",
      barrier: 20000,
      payoutPerPoint: 2,
      durationType: "TIME",
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });
    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    // LOSS=900
    expect(wallets[walletId].balance).toBe(initialBalance - amount);
  });

  test("TURBO: DRAW scenario", async () => {
    const walletId = createTestWallet();
    const amount = 100;
    const initialBalance = wallets[walletId].balance;

    (ensureExchange as jest.Mock)
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        fetchTicker: jest.fn().mockResolvedValue({ last: 20000 }),
        fetchOHLCV: jest.fn().mockResolvedValue([
          [Date.now(), 20000, 20000, 20000, 20000],
          [Date.now() + 60000, 20000, 20000, 20000, 20000],
        ]),
      });

    const order = await BinaryOrderService.createOrder({
      userId: mockUserId,
      currency: mockCurrency,
      pair: mockPair,
      amount,
      side: "UP",
      type: "TURBO",
      barrier: 20000,
      payoutPerPoint: 10,
      durationType: "TIME",
      closedAt: getFutureClosedAt(),
      isDemo: false,
    });

    await BinaryOrderService.processOrder(
      mockUserId,
      order.id,
      `${mockCurrency}/${mockPair}`
    );
    //final=initial=1000
    expect(wallets[walletId].balance).toBe(initialBalance);
  });
});
