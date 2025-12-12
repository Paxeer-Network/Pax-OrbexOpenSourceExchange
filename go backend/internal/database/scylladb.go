package database

import (
	"crypto-exchange-go/internal/config"
	"fmt"
	"time"

	"github.com/gocql/gocql"
)

type ScyllaDB struct {
	session *gocql.Session
}

func NewScyllaDB(cfg config.ScyllaDB) (*ScyllaDB, error) {
	cluster := gocql.NewCluster(cfg.Hosts...)
	cluster.Keyspace = cfg.Keyspace
	cluster.Consistency = gocql.Quorum
	cluster.Timeout = 10 * time.Second
	cluster.ConnectTimeout = 10 * time.Second
	cluster.RetryPolicy = &gocql.ExponentialBackoffRetryPolicy{
		Min:        time.Second,
		Max:        10 * time.Second,
		NumRetries: 3,
	}

	if cfg.Username != "" && cfg.Password != "" {
		cluster.Authenticator = gocql.PasswordAuthenticator{
			Username: cfg.Username,
			Password: cfg.Password,
		}
	}

	session, err := cluster.CreateSession()
	if err != nil {
		return nil, fmt.Errorf("failed to create ScyllaDB session: %w", err)
	}

	return &ScyllaDB{session: session}, nil
}

func (s *ScyllaDB) Session() *gocql.Session {
	return s.session
}

func (s *ScyllaDB) Close() {
	if s.session != nil {
		s.session.Close()
	}
}

func (s *ScyllaDB) ExecuteBatch(queries []string, params [][]interface{}) error {
	batch := s.session.NewBatch(gocql.LoggedBatch)
	
	for i, query := range queries {
		var queryParams []interface{}
		if i < len(params) {
			queryParams = params[i]
		}
		batch.Query(query, queryParams...)
	}

	return s.session.ExecuteBatch(batch)
}
