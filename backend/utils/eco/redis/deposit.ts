import { RedisSingleton } from "@b/utils/redis";

const redis = RedisSingleton.getInstance();
const setAsync = (key: string, value: string) => redis.set(key, value);
const getAsync = (key: string) => redis.get(key);
const delAsync = (key: string) => redis.del(key);
const keysAsync = (pattern: string) => redis.keys(pattern);

export async function storeAndBroadcastTransaction(txDetails, txHash) {
  const pendingTransactions =
    (await loadFromRedis("pendingTransactions")) || {};
  pendingTransactions[txHash] = txDetails;
  await offloadToRedis("pendingTransactions", pendingTransactions);
}

export async function offloadToRedis<T>(key: string, value: T): Promise<void> {
  const serializedValue = JSON.stringify(value);
  await setAsync(key, serializedValue);
}

export async function loadKeysFromRedis(pattern: string): Promise<string[]> {
  try {
    const keys = await keysAsync(pattern);
    return keys;
  } catch (error) {
    console.error("Failed to fetch keys:", error);
    return [];
  }
}

export async function loadFromRedis(identifier: string): Promise<any | null> {
  const dataStr = await getAsync(identifier);
  if (!dataStr) return null;
  try {
    return JSON.parse(dataStr);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

export async function removeFromRedis(key: string): Promise<void> {
  try {
    const delResult = await delAsync(key);
    console.log(`Delete Result for key ${key}: `, delResult);
  } catch (error) {
    console.error(`Failed to delete key ${key}:`, error);
  }
}
