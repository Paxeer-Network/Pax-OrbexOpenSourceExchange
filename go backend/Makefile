.PHONY: build test clean run-api run-matching run-workers docker-build docker-up docker-down

# Build all binaries
build:
	go build -o bin/api-server ./cmd/api-server
	go build -o bin/matching-engine ./cmd/matching-engine
	go build -o bin/background-workers ./cmd/background-workers

# Run tests
test:
	go test -v ./tests/...

# Run tests with coverage
test-coverage:
	go test -cover ./tests/...

# Clean build artifacts
clean:
	rm -rf bin/

# Run API server
run-api:
	go run ./cmd/api-server

# Run matching engine
run-matching:
	go run ./cmd/matching-engine

# Run background workers
run-workers:
	go run ./cmd/background-workers

# Docker commands
docker-build:
	docker build -t crypto-exchange-go .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Database migrations
migrate-mysql:
	mysql -u root -p Orbex < migrations/001_create_tables.sql

migrate-scylla:
	cqlsh -f migrations/scylla/001_create_keyspace.cql

# Development setup
dev-setup:
	go mod download
	mkdir -p bin/

# Lint code
lint:
	golangci-lint run

# Format code
fmt:
	go fmt ./...

# Install dependencies
deps:
	go mod tidy
	go mod download

# Run all services locally
run-all: build
	./bin/api-server &
	./bin/matching-engine &
	./bin/background-workers &
	wait

# Stop all services
stop-all:
	pkill -f api-server || true
	pkill -f matching-engine || true
	pkill -f background-workers || true
