package database

import (
	"fmt"
	"time"

	"crypto-exchange-go/internal/config"

	"github.com/jmoiron/sqlx"
	_ "github.com/go-sql-driver/mysql"
)

type MySQL struct {
	*sqlx.DB
}

func NewMySQL(cfg config.MySQL) (*MySQL, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.Username, cfg.Password, cfg.Host, cfg.Port, cfg.Database)

	db, err := sqlx.Connect("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MySQL: %w", err)
	}

	db.SetMaxOpenConns(100)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(time.Hour)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping MySQL: %w", err)
	}

	return &MySQL{DB: db}, nil
}
