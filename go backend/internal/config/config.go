package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	Port      int       `mapstructure:"port"`
	LogLevel  string    `mapstructure:"log_level"`
	MySQL     MySQL     `mapstructure:"mysql"`
	ScyllaDB  ScyllaDB  `mapstructure:"scylladb"`
	Redis     Redis     `mapstructure:"redis"`
	JWT       JWT       `mapstructure:"jwt"`
	RateLimit RateLimit `mapstructure:"rate_limit"`
}

type MySQL struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Database string `mapstructure:"database"`
	Username string `mapstructure:"username"`
	Password string `mapstructure:"password"`
}

type ScyllaDB struct {
	Hosts    []string `mapstructure:"hosts"`
	Keyspace string   `mapstructure:"keyspace"`
	Username string   `mapstructure:"username"`
	Password string   `mapstructure:"password"`
}

type Redis struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
}

type JWT struct {
	AccessSecret  string `mapstructure:"access_secret"`
	RefreshSecret string `mapstructure:"refresh_secret"`
	AccessExpiry  string `mapstructure:"access_expiry"`
	RefreshExpiry string `mapstructure:"refresh_expiry"`
}

type RateLimit struct {
	RequestsPerMinute int `mapstructure:"requests_per_minute"`
	WindowSeconds     int `mapstructure:"window_seconds"`
}

func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath(".")

	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("failed to read config file: %w", err)
		}
	}

	setDefaults()
	loadFromEnv()

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return &cfg, nil
}

func setDefaults() {
	viper.SetDefault("port", 4000)
	viper.SetDefault("log_level", "info")
	
	viper.SetDefault("mysql.host", "localhost")
	viper.SetDefault("mysql.port", 3306)
	viper.SetDefault("mysql.database", "Orbex")
	
	viper.SetDefault("scylladb.hosts", []string{"127.0.0.1:9042"})
	viper.SetDefault("scylladb.keyspace", "trading")
	
	viper.SetDefault("redis.host", "localhost")
	viper.SetDefault("redis.port", 6379)
	viper.SetDefault("redis.db", 0)
	
	viper.SetDefault("jwt.access_expiry", "30m")
	viper.SetDefault("jwt.refresh_expiry", "30d")
	
	viper.SetDefault("rate_limit.requests_per_minute", 100)
	viper.SetDefault("rate_limit.window_seconds", 60)
}

func loadFromEnv() {
	if port := os.Getenv("NEXT_PUBLIC_BACKEND_PORT"); port != "" {
		if p, err := strconv.Atoi(port); err == nil {
			viper.Set("port", p)
		}
	}

	if dbName := os.Getenv("DB_NAME"); dbName != "" {
		viper.Set("mysql.database", dbName)
	}
	if dbUser := os.Getenv("DB_USER"); dbUser != "" {
		viper.Set("mysql.username", dbUser)
	}
	if dbPassword := os.Getenv("DB_PASSWORD"); dbPassword != "" {
		viper.Set("mysql.password", dbPassword)
	}
	if dbHost := os.Getenv("DB_HOST"); dbHost != "" {
		viper.Set("mysql.host", dbHost)
	}
	if dbPort := os.Getenv("DB_PORT"); dbPort != "" {
		if p, err := strconv.Atoi(dbPort); err == nil {
			viper.Set("mysql.port", p)
		}
	}

	if scyllaHosts := os.Getenv("SCYLLA_CONNECT_POINTS"); scyllaHosts != "" {
		hosts := strings.Split(scyllaHosts, ",")
		for i, host := range hosts {
			hosts[i] = strings.TrimSpace(host)
		}
		viper.Set("scylladb.hosts", hosts)
	}
	if scyllaKeyspace := os.Getenv("SCYLLA_KEYSPACE"); scyllaKeyspace != "" {
		viper.Set("scylladb.keyspace", scyllaKeyspace)
	}
	if scyllaUsername := os.Getenv("SCYLLA_USERNAME"); scyllaUsername != "" {
		viper.Set("scylladb.username", scyllaUsername)
	}
	if scyllaPassword := os.Getenv("SCYLLA_PASSWORD"); scyllaPassword != "" {
		viper.Set("scylladb.password", scyllaPassword)
	}

	if accessSecret := os.Getenv("APP_ACCESS_TOKEN_SECRET"); accessSecret != "" {
		viper.Set("jwt.access_secret", accessSecret)
	}
	if refreshSecret := os.Getenv("APP_REFRESH_TOKEN_SECRET"); refreshSecret != "" {
		viper.Set("jwt.refresh_secret", refreshSecret)
	}
	if accessExpiry := os.Getenv("JWT_EXPIRY"); accessExpiry != "" {
		viper.Set("jwt.access_expiry", accessExpiry)
	}
	if refreshExpiry := os.Getenv("JWT_REFRESH_EXPIRY"); refreshExpiry != "" {
		viper.Set("jwt.refresh_expiry", refreshExpiry)
	}

	if rateLimit := os.Getenv("RATE_LIMIT"); rateLimit != "" {
		if r, err := strconv.Atoi(rateLimit); err == nil {
			viper.Set("rate_limit.requests_per_minute", r)
		}
	}
	if rateLimitExpiry := os.Getenv("RATE_LIMIT_EXPIRY"); rateLimitExpiry != "" {
		if r, err := strconv.Atoi(rateLimitExpiry); err == nil {
			viper.Set("rate_limit.window_seconds", r)
		}
	}
}
