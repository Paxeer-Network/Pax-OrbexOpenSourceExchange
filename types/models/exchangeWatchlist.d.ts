


interface exchangeWatchlistAttributes {
  id: string;
  userId: string;
  symbol: string;
}

type exchangeWatchlistPk = "id";
type exchangeWatchlistId = exchangeWatchlist[exchangeWatchlistPk];
type exchangeWatchlistOptionalAttributes = "id";
type exchangeWatchlistCreationAttributes = Optional<
  exchangeWatchlistAttributes,
  exchangeWatchlistOptionalAttributes
>;
