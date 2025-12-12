import { logError } from "../logger";
import { BinaryOrderService } from "@b/api/exchange/binary/order/util/BinaryOrderService";

export async function processPendingOrders() {
  try {
    BinaryOrderService.processPendingOrders();
  } catch (error) {
    logError("processPendingOrders", error, __filename);
    throw error;
  }
}
