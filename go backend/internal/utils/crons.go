package utils

import (
	"context"
	"crypto-exchange-go/internal/services"
	"time"

	"github.com/sirupsen/logrus"
)

type CronManager struct {
	icoService       *services.IcoService
	stakingService   *services.StakingService
	aiService        *services.AiService
	forexService     *services.ForexService
	affiliateService *services.AffiliateService
	logger           *logrus.Logger
}

func NewCronManager(
	icoService *services.IcoService,
	stakingService *services.StakingService,
	aiService *services.AiService,
	forexService *services.ForexService,
	affiliateService *services.AffiliateService,
	logger *logrus.Logger,
) *CronManager {
	return &CronManager{
		icoService:       icoService,
		stakingService:   stakingService,
		aiService:        aiService,
		forexService:     forexService,
		affiliateService: affiliateService,
		logger:           logger,
	}
}

func (c *CronManager) StartCronJobs(ctx context.Context) {
	go c.processIcoPhases(ctx)
	go c.processStakes(ctx)
	go c.processAiInvestments(ctx)
	go c.processForexInvestments(ctx)
	go c.processAffiliateRewards(ctx)
}

func (c *CronManager) processIcoPhases(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			err := c.icoService.ProcessPhases(ctx)
			if err != nil {
				c.logger.WithError(err).Error("Failed to process ICO phases")
			}
		}
	}
}

func (c *CronManager) processStakes(ctx context.Context) {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			err := c.stakingService.ProcessStakes(ctx)
			if err != nil {
				c.logger.WithError(err).Error("Failed to process stakes")
			}
		}
	}
}

func (c *CronManager) processAiInvestments(ctx context.Context) {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			err := c.aiService.ProcessInvestments(ctx)
			if err != nil {
				c.logger.WithError(err).Error("Failed to process AI investments")
			}
		}
	}
}

func (c *CronManager) processForexInvestments(ctx context.Context) {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			err := c.forexService.ProcessInvestments(ctx)
			if err != nil {
				c.logger.WithError(err).Error("Failed to process forex investments")
			}
		}
	}
}

func (c *CronManager) processAffiliateRewards(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			err := c.affiliateService.ProcessRewards(ctx)
			if err != nil {
				c.logger.WithError(err).Error("Failed to process affiliate rewards")
			}
		}
	}
}
