import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
import { shallow } from "zustand/shallow";

import { useDashboardStore } from "@/stores/dashboard";
import useMarketStore from "@/stores/trade/market";
import useWebSocketStore from "@/stores/trade/ws";
import $fetch from "@/utils/api";
import { formatLargeNumber } from "@/utils/market";

import MarketsToolbar from "./MarketsToolbar";
import MarketsTable from "./MarketsTable";
import MarketsPagination from "./MarketsPagination";

const MarketsBase = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { isDark, hasExtension, extensions } = useDashboardStore();
  const {
    marketData,
    fetchData,
    setSearchQuery: setStoreSearchQuery,
    getPrecisionBySymbol,
    setWithEco,
  } = useMarketStore((state) => state, shallow);

  const {
    createConnection,
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
  } = useWebSocketStore();

  const [baseItems, setBaseItems] = useState<any[]>([]); // Base data including ticker updates
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sorted, setSorted] = useState<{ field: string; rule: "asc" | "desc" }>(
    {
      field: "",
      rule: "asc",
    }
  );
  const [pagination, setPagination] = useState({
    total: 0,
    lastPage: 0,
    currentPage: 1,
    from: 1,
    to: 25,
  });

  const [tickersFetched, setTickersFetched] = useState(false);
  const [tickersConnected, setTickersConnected] = useState(false);
  const [ecoTickersConnected, setEcoTickersConnected] = useState(false);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 100),
    [fetchData]
  );

  const parseToNumber = useCallback((value: any) => {
    const parsedValue = typeof value === "number" ? value : parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }, []);

  const updateItem = useCallback(
    (existingItem, update) => {
      const precision = getPrecisionBySymbol(existingItem.symbol) || {
        price: 8,
        amount: 8,
      };

      return {
        ...existingItem,
        price:
          update.last !== undefined
            ? parseToNumber(update.last).toFixed(precision.price)
            : parseToNumber(existingItem.price || 0).toFixed(precision.price),
        change:
          update.change !== undefined
            ? parseToNumber(update.change).toFixed(2)
            : parseToNumber(existingItem.change || 0).toFixed(2),
        baseVolume:
          update.baseVolume !== undefined
            ? formatLargeNumber(update.baseVolume, precision.amount)
            : formatLargeNumber(existingItem.baseVolume || 0, precision.amount),
        quoteVolume:
          update.quoteVolume !== undefined
            ? formatLargeNumber(update.quoteVolume, precision.price)
            : formatLargeNumber(existingItem.quoteVolume || 0, precision.price),
        high: update.high !== undefined ? update.high : existingItem.high,
        low: update.low !== undefined ? update.low : existingItem.low,
        percentage:
          update.percentage !== undefined
            ? update.percentage
            : existingItem.percentage,
      };
    },
    [getPrecisionBySymbol, parseToNumber]
  );

  // Initialize baseItems from marketData
  useEffect(() => {
    setBaseItems(marketData);
  }, [marketData]);

  // Apply ticker updates to baseItems, not items
  const updateItemsFromTickers = useCallback(
    (newData: any) => {
      setBaseItems((prevBaseItems) => {
        let updated = false;
        const nextBase = prevBaseItems.map((item) => {
          const dataUpdate = newData[item.symbol];
          if (dataUpdate) {
            const updatedItem = updateItem(item, dataUpdate);
            if (JSON.stringify(updatedItem) !== JSON.stringify(item)) {
              updated = true;
              return updatedItem;
            }
          }
          return item;
        });
        return updated ? nextBase : prevBaseItems;
      });
    },
    [updateItem]
  );

  const fetchTickers = useCallback(async () => {
    const { data, error } = await $fetch({
      url: "/api/exchange/ticker",
      silent: true,
    });
    if (!error && data) {
      updateItemsFromTickers(data);
    }
    setTickersFetched(true);
  }, [updateItemsFromTickers]);

  const debouncedFetchTickers = useMemo(
    () => debounce(fetchTickers, 100),
    [fetchTickers]
  );

  // Fetch initial data and tickers
  useEffect(() => {
    if (router.isReady && extensions) {
      setWithEco(hasExtension("ecosystem"));
      debouncedFetchData();
      debouncedFetchTickers();
    }
  }, [router.isReady, extensions]);

  // Initialize WebSocket connections for tickers
  useEffect(() => {
    if (tickersFetched) {
      createConnection("tickersConnection", `/api/exchange/ticker`, {
        onOpen: () => {
          subscribe("tickersConnection", "tickers");
        },
      });
      setTickersConnected(true);

      if (hasExtension("ecosystem")) {
        createConnection("ecoTickersConnection", `/api/ext/ecosystem/ticker`, {
          onOpen: () => {
            subscribe("ecoTickersConnection", "tickers");
          },
        });
        setEcoTickersConnected(true);
      }

      return () => {
        unsubscribe("tickersConnection", "tickers");
        if (hasExtension("ecosystem")) {
          unsubscribe("ecoTickersConnection", "tickers");
        }
      };
    }
  }, [tickersFetched, createConnection, subscribe, unsubscribe, hasExtension]);

  const handleTickerMessage = useCallback(
    (message) => {
      const { data } = message;
      if (data) updateItemsFromTickers(data);
    },
    [updateItemsFromTickers]
  );

  const messageFilter = useCallback(
    (message) => message.stream === "tickers",
    []
  );

  useEffect(() => {
    if (tickersConnected) {
      addMessageHandler(
        "tickersConnection",
        handleTickerMessage,
        messageFilter
      );
      return () => {
        removeMessageHandler("tickersConnection", handleTickerMessage);
      };
    }
  }, [
    tickersConnected,
    addMessageHandler,
    removeMessageHandler,
    handleTickerMessage,
    messageFilter,
  ]);

  useEffect(() => {
    if (ecoTickersConnected) {
      addMessageHandler(
        "ecoTickersConnection",
        handleTickerMessage,
        messageFilter
      );
      return () => {
        removeMessageHandler("ecoTickersConnection", handleTickerMessage);
      };
    }
  }, [
    ecoTickersConnected,
    addMessageHandler,
    removeMessageHandler,
    handleTickerMessage,
    messageFilter,
  ]);

  const compareOnKey = useCallback((key: string, rule: "asc" | "desc") => {
    return (a: any, b: any) => {
      const valueA = a[key] ?? null;
      const valueB = b[key] ?? null;

      if (typeof valueA === "string" && typeof valueB === "string") {
        return rule === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      if (typeof valueA === "number" && typeof valueB === "number") {
        return rule === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    };
  }, []);

  // Derive items from baseItems, searchQuery, and sorted
  useEffect(() => {
    let newItems = [...baseItems];

    // Filter by search
    if (searchQuery) {
      newItems = newItems.filter((item) =>
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort if needed
    if (sorted.field) {
      newItems.sort(compareOnKey(sorted.field, sorted.rule));
    }

    setItems(newItems);
  }, [baseItems, searchQuery, sorted, compareOnKey]);

  const updatePagination = useCallback(
    (totalItems: number, itemsPerPage: number, page: number) => {
      const lastPage = Math.ceil(totalItems / itemsPerPage);
      const from = (page - 1) * itemsPerPage + 1;
      const to = Math.min(page * itemsPerPage, totalItems);

      setPagination((prev) => {
        if (
          prev.total === totalItems &&
          prev.lastPage === lastPage &&
          prev.currentPage === page &&
          prev.from === from &&
          prev.to === to
        ) {
          return prev;
        }
        return { total: totalItems, lastPage, currentPage: page, from, to };
      });

      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const newPages = Array.from({ length: totalPages }, (_, i) => i + 1);
      setPages((prev) =>
        JSON.stringify(prev) === JSON.stringify(newPages) ? prev : newPages
      );
    },
    []
  );

  useEffect(() => {
    updatePagination(items.length, perPage, currentPage);
  }, [items.length, perPage, currentPage, updatePagination]);

  const changePage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.lastPage && page !== currentPage) {
        setCurrentPage(page);
      }
    },
    [pagination.lastPage, currentPage]
  );

  const changePerPage = useCallback(
    (newPerPage: number) => {
      if (newPerPage !== perPage) {
        setPerPage(newPerPage);
        setCurrentPage(1);
      }
    },
    [perPage]
  );

  const sortData = useCallback((field: string, rule: "asc" | "desc") => {
    setSorted({ field, rule });
    setCurrentPage(1);
  }, []);

  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setStoreSearchQuery(query); // keep store in sync if needed
      setCurrentPage(1);
    },
    [setStoreSearchQuery]
  );

  const handleNavigation = useCallback(
    (symbol: string) => {
      router.push(`/trade/${symbol.replace("/", "_")}`);
    },
    [router]
  );

  return (
    <main id="datatable">
      <MarketsToolbar t={t} onSearch={search} />
      <MarketsTable
        t={t}
        items={items}
        pagination={pagination}
        perPage={perPage}
        sorted={sorted}
        sort={sortData}
        isDark={isDark}
        handleNavigation={handleNavigation}
      />
      <MarketsPagination
        t={t}
        pagination={pagination}
        pages={pages}
        currentPage={currentPage}
        perPage={perPage}
        changePage={changePage}
        changePerPage={changePerPage}
      />
    </main>
  );
};

export default memo(MarketsBase);
