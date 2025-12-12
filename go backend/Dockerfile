# Multi-stage build for Go application
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o api-server ./cmd/api-server
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o matching-engine ./cmd/matching-engine
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o background-workers ./cmd/background-workers

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/

# Copy binaries from builder stage
COPY --from=builder /app/api-server .
COPY --from=builder /app/matching-engine .
COPY --from=builder /app/background-workers .

# Copy configuration
COPY --from=builder /app/configs ./configs

# Expose port
EXPOSE 4000

# Default command
CMD ["./api-server"]
