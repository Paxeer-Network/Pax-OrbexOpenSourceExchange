package main

import (
	"crypto-exchange-go/internal/config"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/services"
	"crypto-exchange-go/pkg/logger"
	"os"
	"os/signal"
	"syscall"

	"github.com/sirupsen/logrus"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		logrus.Fatalf("Failed to load configuration: %v", err)
	}

	log := logger.New(cfg.LogLevel)

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

	matchingEngine, err := services.NewMatchingEngine(scyllaDB, redisClient, log)
	if err != nil {
		log.Fatalf("Failed to initialize matching engine: %v", err)
	}

	log.Info("Matching engine started successfully")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Matching engine shutting down...")
}
