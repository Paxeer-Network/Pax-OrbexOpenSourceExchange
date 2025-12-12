import { v4 as uuidv4 } from 'uuid';

/**
 * Ensures UUID generation for model creation
 * This utility helps prevent "Field 'id' doesn't have a default value" errors
 */
export function ensureUUID(data: any): any {
  if (!data.id) {
    data.id = uuidv4();
  }
  return data;
}

/**
 * Safe model creation with automatic UUID generation
 */
export async function safeCreate<T>(model: any, data: any): Promise<T> {
  const dataWithUUID = ensureUUID(data);
  return await model.create(dataWithUUID);
}

export { uuidv4 };
