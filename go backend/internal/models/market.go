package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type MarketMetadata struct {
	Precision struct {
		Amount int `json:"amount"`
		Price  int `json:"price"`
	} `json:"precision"`
	Limits struct {
		Amount struct {
			Min decimal.Decimal `json:"min"`
			Max decimal.Decimal `json:"max"`
		} `json:"amount"`
		Price struct {
			Min decimal.Decimal `json:"min"`
			Max decimal.Decimal `json:"max"`
		} `json:"price"`
		Cost struct {
			Min decimal.Decimal `json:"min"`
			Max decimal.Decimal `json:"max"`
		} `json:"cost"`
	} `json:"limits"`
	Taker decimal.Decimal `json:"taker"`
	Maker decimal.Decimal `json:"maker"`
}

func (m MarketMetadata) Value() (driver.Value, error) {
	return json.Marshal(m)
}

func (m *MarketMetadata) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, m)
	case string:
		return json.Unmarshal([]byte(v), m)
	}

	return nil
}

type ExchangeMarket struct {
	ID         uuid.UUID       `json:"id" db:"id"`
	Currency   string          `json:"currency" db:"currency"`
	Pair       string          `json:"pair" db:"pair"`
	IsTrending *bool           `json:"isTrending" db:"isTrending"`
	IsHot      *bool           `json:"isHot" db:"isHot"`
	Metadata   *MarketMetadata `json:"metadata" db:"metadata"`
	Status     bool            `json:"status" db:"status"`
}

type Ticker struct {
	Symbol      string          `json:"symbol"`
	Last        decimal.Decimal `json:"last"`
	BaseVolume  decimal.Decimal `json:"baseVolume"`
	QuoteVolume decimal.Decimal `json:"quoteVolume"`
	Change      decimal.Decimal `json:"change"`
	Percentage  decimal.Decimal `json:"percentage"`
	High        decimal.Decimal `json:"high"`
	Low         decimal.Decimal `json:"low"`
}

type OrderBookEntry struct {
	Price  decimal.Decimal `json:"price"`
	Amount decimal.Decimal `json:"amount"`
}

type OrderBook struct {
	Symbol string           `json:"symbol"`
	Bids   []OrderBookEntry `json:"bids"`
	Asks   []OrderBookEntry `json:"asks"`
}

type Candle struct {
	Symbol    string          `json:"symbol"`
	Interval  string          `json:"interval"`
	Open      decimal.Decimal `json:"open"`
	High      decimal.Decimal `json:"high"`
	Low       decimal.Decimal `json:"low"`
	Close     decimal.Decimal `json:"close"`
	Volume    decimal.Decimal `json:"volume"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
}
