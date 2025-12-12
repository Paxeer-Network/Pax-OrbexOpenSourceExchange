package main

import (
	"context"
	"crypto-exchange-go/internal/config"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/pkg/logger"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/sirupsen/logrus"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		logrus.Fatalf("Failed to load configuration: %v", err)
	}

	log := logger.New(cfg.LogLevel)

	mysql, err := database.NewMySQL(cfg.MySQL)
	if err != nil {
		log.Fatalf("Failed to connect to MySQL: %v", err)
	}
	defer mysql.Close()

	scyllaDB, err := database.NewScyllaDB(cfg.ScyllaDB)
	if err != nil {
		log.Fatalf("Failed to connect to ScyllaDB: %v", err)
	}
	defer scyllaDB.Close()

	redisClient, err := database.NewRedis(cfg.Redis)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	defer redisClient.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go startPriceUpdateWorker(ctx, log, mysql, scyllaDB, redisClient)
	go startWalletMonitorWorker(ctx, log, mysql)
	go startDatabaseCleanupWorker(ctx, log, mysql, scyllaDB)

	log.Info("Background workers started successfully")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Background workers shutting down...")
	cancel()
}

func startPriceUpdateWorker(ctx context.Context, log *logrus.Logger, mysql *database.MySQL, scyllaDB *database.ScyllaDB, redis *database.Redis) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			log.Debug("Running price update worker")
		}
	}
}

func startWalletMonitorWorker(ctx context.Context, log *logrus.Logger, mysql *database.MySQL) {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			log.Debug("Running wallet monitor worker")
		}
	}
}

func startDatabaseCleanupWorker(ctx context.Context, log *logrus.Logger, mysql *database.MySQL, scyllaDB *database.ScyllaDB) {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			log.Debug("Running database cleanup worker")
		}
	}
}
