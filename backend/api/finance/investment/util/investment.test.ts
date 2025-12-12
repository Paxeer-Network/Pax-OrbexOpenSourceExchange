// backend/api/finance/investment/util/investment.test.ts

import { sequelize, models } from "@b/db";
import { createInvestmentRecord } from "../index.post";
import { processGeneralInvestments } from "@b/utils/crons/investment";
import { processForexInvestments } from "@b/utils/crons/forex";
import { sendInvestmentEmail } from "@b/utils/emails";
import { handleNotification } from "@b/utils/notifications";

// 1) Mock out logger, emails, notifications
jest.mock("@b/utils/logger", () => ({
  logError: jest.fn(),
}));
jest.mock("@b/utils/emails", () => ({
  sendInvestmentEmail: jest.fn(),
}));
jest.mock("@b/utils/notifications", () => ({
  handleNotification: jest.fn(),
}));

// 2) Mock @b/db so no real DB calls occur
jest.mock("@b/db", () => {
  const transactionMock = jest.fn();
  return {
    sequelize: {
      transaction: transactionMock,
      LOCK: { UPDATE: "UPDATE" },
    },
    models: {
      user: { findByPk: jest.fn() },
      wallet: { findOne: jest.fn(), update: jest.fn() },
      investmentPlan: { findByPk: jest.fn() },
      investmentDuration: { findByPk: jest.fn() },
      forexPlan: { findByPk: jest.fn() },
      forexDuration: { findByPk: jest.fn() },
      investment: {
        create: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn(),
      },
      forexInvestment: {
        create: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn(),
      },
      transaction: { create: jest.fn() },
    },
  };
});

// -----------------
// In-memory "DB" objects
// Store them by string key so the DB "id" can match exactly ("4597", etc.)
// -----------------
let mockWallets: Record<string, any> = {};
let mockInvestments: Record<string, any> = {}; // <--- Now uses string keys
let mockPlans: Record<string, any> = {};
let mockDurations: Record<string, any> = {};
let mockUsers: Record<string, any> = {};

const userId = "user_1";
const walletId = "wallet_1";
const planId = "plan_1";
const durationId = "duration_1";

beforeAll(() => {
  // Use real timers so date-fns sees real time
  jest.useRealTimers();
});

beforeEach(() => {
  jest.clearAllMocks();

  // Fake out sequelize.transaction
  (sequelize.transaction as jest.Mock).mockImplementation(async (callback) => {
    const fakeTx = { LOCK: { UPDATE: "UPDATE" } };
    return callback(fakeTx);
  });

  // Reset in-memory DB
  mockWallets = {};
  mockInvestments = {};
  mockPlans = {};
  mockDurations = {};
  mockUsers = {};

  // Default user/wallet/plan/duration
  mockUsers[userId] = { id: userId, email: "test@example.com" };
  mockWallets[walletId] = {
    id: walletId,
    userId,
    balance: 5000,
    currency: "USD",
    type: "SPOT",
  };
  mockPlans[planId] = {
    id: planId,
    currency: "USD",
    walletType: "SPOT",
    defaultProfit: 100,
    defaultResult: "WIN",
    profitPercentage: 10,
  };
  mockDurations[durationId] = {
    id: durationId,
    duration: 1,
    timeframe: "DAY",
  };

  // -------------- Model Mocks --------------
  models.user.findByPk.mockImplementation(async (id: string) => {
    return mockUsers[id] || null;
  });

  models.wallet.findOne.mockImplementation(async ({ where }) => {
    console.log("WALLET.findOne => where=", where);
    const w = Object.values(mockWallets).find(
      (x) =>
        x.userId === where.userId &&
        x.currency === where.currency &&
        x.type === where.type
    );
    if (!w) {
      console.log("WALLET not found =>", where);
      return null;
    }
    return {
      ...w,
      get: () => ({ ...w }),
    };
  });
  models.wallet.update.mockImplementation(async (data, { where }) => {
    const w = mockWallets[where.id];
    if (w) mockWallets[where.id] = { ...w, ...data };
  });

  // Plans & Durations
  models.investmentPlan.findByPk.mockImplementation(async (id: string) => {
    return mockPlans[id] || null;
  });
  models.investmentDuration.findByPk.mockImplementation(async (id: string) => {
    return mockDurations[id] || null;
  });
  models.forexPlan.findByPk.mockImplementation(async (id: string) => {
    return mockPlans[id] || null;
  });
  models.forexDuration.findByPk.mockImplementation(async (id: string) => {
    return mockDurations[id] || null;
  });

  // -------------- investment --------------
  models.investment.create.mockImplementation(async (data: any) => {
    // Generate a string ID
    const newId = Math.floor(Math.random() * 99999).toString();
    const record = { ...data, id: newId, investmentType: "GENERAL" };
    mockInvestments[newId] = record;
    return record;
  });
  models.investment.findByPk.mockImplementation(async (id: string) => {
    return mockInvestments[id] || null;
  });
  models.investment.update.mockImplementation(async (data, { where }) => {
    const inv = mockInvestments[where.id];
    if (inv) {
      mockInvestments[where.id] = { ...inv, ...data };
    }
  });
  models.investment.findAll.mockImplementation(async ({ where }) => {
    return Object.values(mockInvestments).filter((inv: any) => {
      if (inv.investmentType !== "GENERAL") return false;
      if (where.status && inv.status !== where.status) return false;
      // embed plan/duration
      const plan = mockPlans[inv.planId];
      if (plan) inv.plan = { ...plan };
      const dur = mockDurations[inv.durationId];
      if (dur) inv.duration = { ...dur };
      return true;
    });
  });

  // -------------- forexInvestment --------------
  models.forexInvestment.create.mockImplementation(async (data: any) => {
    // Also generate a string ID
    const fxId = Math.floor(Math.random() * 99999).toString();
    const row = { ...data, id: fxId, investmentType: "FOREX" };
    mockInvestments[fxId] = row;
    return row;
  });
  models.forexInvestment.findByPk.mockImplementation(async (id: string) => {
    return mockInvestments[id] || null;
  });
  models.forexInvestment.update.mockImplementation(async (data, { where }) => {
    // If the code calls "where: { id: '4597' }", we do mockInvestments["4597"]
    const inv = mockInvestments[where.id];
    if (!inv) {
      console.log("FOREX update => no match for ID:", where.id);
      return [0];
    }
    mockInvestments[where.id] = { ...inv, ...data };
    return [1]; // Indicate 1 row updated
  });
  models.forexInvestment.findAll.mockImplementation(async ({ where }) => {
    return Object.values(mockInvestments).filter((inv: any) => {
      if (inv.investmentType !== "FOREX") return false;
      if (where.status && inv.status !== where.status) return false;
      // embed plan/duration
      const plan = mockPlans[inv.planId];
      if (plan) inv.plan = { ...plan };
      const dur = mockDurations[inv.durationId];
      if (dur) inv.duration = { ...dur };
      return true;
    });
  });

  // Transaction
  models.transaction.create.mockImplementation(async (data) => {
    return { ...data, id: "tx_" + Math.random().toString(36).slice(2) };
  });
});

afterAll(() => {
  jest.useRealTimers();
});

// -----------------
// TESTS
// -----------------
describe("Investment Flow Tests - (Mocked @b/db style)", () => {
  it("Should create a new investment (general)", async () => {
    const input = {
      user: { id: userId },
      body: {
        type: "general",
        planId,
        amount: 1000,
        durationId,
      },
    } as any;

    const result = await createInvestmentRecord(input);
    expect(result).toEqual({ message: "Investment created successfully" });

    // 5000 => 4000
    expect(mockWallets[walletId].balance).toBe(4000);
    // Should have 1 new investment in mockInvestments
    const keys = Object.keys(mockInvestments);
    expect(keys.length).toBe(1);
  });

  it("Should complete a general investment (WIN) => principal + ROI", async () => {
    // wallet => 4000
    mockWallets[walletId].balance = 4000;

    // We'll store "1111" as a string key
    const invId = "1111";
    mockInvestments[invId] = {
      id: invId,
      userId,
      planId,
      durationId,
      walletId,
      amount: 1000,
      profit: 100,
      result: "WIN",
      status: "ACTIVE",
      investmentType: "GENERAL",
      createdAt: new Date(Date.now() - 2 * 86400000),
    };

    await processGeneralInvestments();

    // Now expect COMPLETED
    expect(mockInvestments[invId].status).toBe("COMPLETED");
    // 4000 + (1000 + 100) = 5100
    expect(mockWallets[walletId].balance).toBe(5100);
  });

  it("Should complete a FOREX investment (WIN) => principal + ROI", async () => {
    // wallet => 4000
    mockWallets[walletId].balance = 4000;

    // A custom plan/duration
    const fxPlanId = "fx_plan_99";
    const fxDurId = "fx_dur_99";
    mockPlans[fxPlanId] = {
      id: fxPlanId,
      currency: "USD",
      walletType: "SPOT",
      defaultProfit: 200,
      defaultResult: "WIN",
    };
    mockDurations[fxDurId] = {
      id: fxDurId,
      duration: 1,
      timeframe: "DAY",
    };

    // 1) "create" a new forex investment to generate a string ID
    const newFx = await models.forexInvestment.create({
      userId,
      planId: fxPlanId,
      durationId: fxDurId,
      walletId,
      amount: 1000,
      profit: 200,
      result: "WIN",
      status: "ACTIVE",
      createdAt: new Date(),
    });
    // "newFx.id" is a string, e.g. "4597"

    // 2) Overwrite its "createdAt" so it's 2 days old
    mockInvestments[newFx.id].createdAt = new Date(Date.now() - 2 * 86400000);

    await processForexInvestments();

    console.log("FOREX final =>", mockInvestments[newFx.id]);

    // Now we expect COMPLETED
    expect(mockInvestments[newFx.id].status).toBe("COMPLETED");
    // wallet => 4000 + 1200 = 5200
    expect(mockWallets[walletId].balance).toBe(5200);
  });
});
