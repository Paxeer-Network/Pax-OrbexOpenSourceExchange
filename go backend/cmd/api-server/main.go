package main

import (
	"context"
	"crypto-exchange-go/internal/config"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/handlers"
	"crypto-exchange-go/internal/handlers/admin"
	"crypto-exchange-go/internal/handlers/content"
	"crypto-exchange-go/internal/handlers/exchange"
	"crypto-exchange-go/internal/handlers/finance"
	"crypto-exchange-go/internal/handlers/system"
	"crypto-exchange-go/internal/handlers/user"
	"crypto-exchange-go/internal/middleware"
	"crypto-exchange-go/internal/services"
	"crypto-exchange-go/internal/utils"
	"crypto-exchange-go/pkg/logger"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
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

	redis, err := database.NewRedis(cfg.Redis)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	defer redis.Close()

	matchingEngine, err := services.NewMatchingEngine(scyllaDB, redis, log)
	if err != nil {
		log.Fatalf("Failed to initialize matching engine: %v", err)
	}

	icoService := services.NewIcoService(mysql, log)
	futuresService := services.NewFuturesService(mysql, log)
	ecosystemService := services.NewEcosystemService(mysql, log)
	ecommerceService := services.NewEcommerceService(mysql, log)
	affiliateService := services.NewAffiliateService(mysql, log)
	p2pService := services.NewP2pService(mysql, log)
	stakingService := services.NewStakingService(mysql, log)
	mailwizardService := services.NewMailwizardService(mysql, log)
	aiService := services.NewAiService(mysql, log)
	forexService := services.NewForexService(mysql, log)
	
	walletService := services.NewWalletService(mysql, log)
	orderService := services.NewOrderService(mysql, scyllaDB, redis, matchingEngine, log)
	transactionService := services.NewTransactionService(mysql, log)
	userService := services.NewUserService(mysql, log)
	kycService := services.NewKYCService(mysql, log)
	notificationService := services.NewNotificationService(mysql, log)
	supportService := services.NewSupportService(mysql, log)
	depositService := services.NewDepositService(mysql, walletService, log)
	withdrawalService := services.NewWithdrawalService(mysql, walletService, log)
	marketService := services.NewMarketService(mysql, scyllaDB, redis, log)
	blogService := services.NewBlogService(mysql, log)
	databaseService := services.NewDatabaseService(mysql, log)

	if gin.Mode() == gin.ReleaseMode {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.CORS())
	router.Use(middleware.Logger(log))
	router.Use(middleware.RateLimit(cfg.RateLimit))

	hub := handlers.NewWebSocketHub(log)
	go hub.Run()

	orderHandler := handlers.GetOrderHandler(orderService, walletService, hub, log)

	cronManager := utils.NewCronManager(icoService, stakingService, aiService, forexService, affiliateService, log)
	go cronManager.StartCronJobs(context.Background())

	adminHandlers := handlers.NewHandlers(mysql, scyllaDB, redis, matchingEngine, log)
	icoHandler := admin.NewIcoHandler(icoService, log)
	futuresHandler := admin.NewFuturesHandler(futuresService, log)
	ecosystemHandler := admin.NewEcosystemHandler(ecosystemService, log)
	ecommerceHandler := admin.NewEcommerceHandler(ecommerceService, log)
	affiliateHandler := admin.NewAffiliateHandler(affiliateService, log)
	p2pHandler := admin.NewP2pHandler(p2pService, log)
	stakingHandler := admin.NewStakingHandler(stakingService, log)
	mailwizardHandler := admin.NewMailwizardHandler(mailwizardService, log)
	aiHandler := admin.NewAiHandler(aiService, log)
	forexHandler := admin.NewForexHandler(forexService, log)

	financeWalletHandler := finance.NewWalletHandler(walletService, log)
	financeTransactionHandler := finance.NewTransactionHandler(transactionService, log)
	financeDepositHandler := finance.NewDepositHandler(depositService, log)
	financeWithdrawalHandler := finance.NewWithdrawalHandler(withdrawalService, log)
	
	userProfileHandler := user.NewProfileHandler(userService, log)
	userKYCHandler := user.NewKYCHandler(kycService, log)
	userNotificationHandler := user.NewNotificationHandler(notificationService, log)
	userSupportHandler := user.NewSupportHandler(supportService, log)
	
	exchangeMarketHandler := exchange.NewMarketHandler(marketService, log)
	exchangeOrderHandler := exchange.NewOrderHandler(orderService, log)
	
	contentBlogHandler := content.NewBlogHandler(blogService, log)
	systemDatabaseHandler := system.NewDatabaseHandler(databaseService, log)

	api := router.Group("/api")
	{
		auth := api.Group("")
		auth.Use(middleware.Auth(cfg.JWT))
		{
			exchangeRoutes := auth.Group("/exchange")
			{
				exchangeRoutes.POST("/order", adminHandlers.CreateOrder)
				exchangeRoutes.GET("/order", adminHandlers.GetOrders)
				exchangeRoutes.GET("/order/:id", adminHandlers.GetOrder)
				exchangeRoutes.DELETE("/order/:id", adminHandlers.CancelOrder)
				exchangeRoutes.GET("/orderbook/:currency/:pair", adminHandlers.GetOrderBook)
				exchangeRoutes.GET("/market", exchangeMarketHandler.GetMarkets)
				exchangeRoutes.GET("/market/:currency/:pair", exchangeMarketHandler.GetMarket)
				exchangeRoutes.GET("/ticker", exchangeMarketHandler.GetTickers)
				exchangeRoutes.GET("/ticker/:symbol", exchangeMarketHandler.GetTicker)
				exchangeRoutes.GET("/orderbook/:symbol", exchangeMarketHandler.GetOrderBook)
				exchangeRoutes.GET("/trades/:symbol", exchangeMarketHandler.GetTrades)
				exchangeRoutes.GET("/chart/:symbol", exchangeMarketHandler.GetChartData)
				exchangeRoutes.POST("/order", exchangeOrderHandler.CreateOrder)
				exchangeRoutes.GET("/order", exchangeOrderHandler.GetOrders)
				exchangeRoutes.GET("/order/:id", exchangeOrderHandler.GetOrder)
				exchangeRoutes.DELETE("/order/:id", exchangeOrderHandler.CancelOrder)
			}

			finance := auth.Group("/finance")
			{
				finance.GET("/wallet", financeWalletHandler.GetWallets)
				finance.GET("/wallet/:type/:currency", financeWalletHandler.GetWallet)
				finance.GET("/transaction", financeTransactionHandler.GetTransactions)
				finance.GET("/transaction/:id", financeTransactionHandler.GetTransaction)
				finance.POST("/transaction/analysis", financeTransactionHandler.AnalyzeTransactions)
				finance.POST("/deposit/fiat", financeDepositHandler.CreateFiatDeposit)
				finance.POST("/deposit/spot", financeDepositHandler.CreateSpotDeposit)
				finance.POST("/deposit/fiat/stripe/verify", financeDepositHandler.VerifyStripeDeposit)
				finance.POST("/deposit/fiat/paypal/verify", financeDepositHandler.VerifyPayPalDeposit)
				finance.GET("/deposit/address/:currency", financeDepositHandler.GetDepositAddress)
				finance.POST("/withdraw/fiat", financeWithdrawalHandler.CreateFiatWithdrawal)
				finance.POST("/withdraw/spot", financeWithdrawalHandler.CreateSpotWithdrawal)
				finance.GET("/withdraw", financeWithdrawalHandler.GetWithdrawals)
				finance.DELETE("/withdraw/:id", financeWithdrawalHandler.CancelWithdrawal)
			}

			userRoutes := auth.Group("/user")
			{
				userRoutes.PUT("/profile", userProfileHandler.UpdateProfile)
				userRoutes.GET("/profile", userProfileHandler.GetProfile)
				userRoutes.POST("/profile/wallet/connect", userProfileHandler.ConnectWallet)
				userRoutes.POST("/profile/otp", userProfileHandler.SetupOTP)
				userRoutes.POST("/profile/otp/verify", userProfileHandler.VerifyOTP)
				userRoutes.POST("/kyc/application", userKYCHandler.SubmitApplication)
				userRoutes.GET("/kyc/application", userKYCHandler.GetApplications)
				userRoutes.GET("/kyc/application/:id", userKYCHandler.GetApplication)
				userRoutes.PUT("/kyc/application/:id", userKYCHandler.UpdateApplication)
				userRoutes.GET("/notification", userNotificationHandler.GetNotifications)
				userRoutes.PUT("/notification/:id", userNotificationHandler.MarkAsRead)
				userRoutes.DELETE("/notification/:id", userNotificationHandler.DeleteNotification)
				userRoutes.DELETE("/notification/clean", userNotificationHandler.CleanupNotifications)
				userRoutes.DELETE("/notification", userNotificationHandler.BulkDelete)
				userRoutes.POST("/support/ticket", userSupportHandler.CreateTicket)
				userRoutes.GET("/support/ticket", userSupportHandler.GetTickets)
				userRoutes.GET("/support/ticket/:id", userSupportHandler.GetTicket)
				userRoutes.POST("/support/ticket/:id", userSupportHandler.AddMessage)
				userRoutes.PUT("/support/ticket/:id/close", userSupportHandler.CloseTicket)
			}
		}

		public := api.Group("")
		{
			public.GET("/exchange/market", adminHandlers.GetMarkets)
			public.GET("/exchange/ticker", adminHandlers.GetTickers)
			public.GET("/exchange/ticker/:symbol", adminHandlers.GetTicker)
		}
		
		admin := auth.Group("/admin/ext")
		{
			ico := admin.Group("/ico")
			{
				ico.GET("/project", icoHandler.GetProjects)
				ico.GET("/project/:id", icoHandler.GetProject)
				ico.POST("/project", icoHandler.CreateProject)
				ico.PUT("/project/:id", icoHandler.UpdateProject)
				ico.DELETE("/project/:id", icoHandler.DeleteProject)
				ico.GET("/token", icoHandler.GetTokens)
				ico.GET("/token/:id", icoHandler.GetToken)
				ico.POST("/token", icoHandler.CreateToken)
				ico.GET("/phase", icoHandler.GetPhases)
				ico.POST("/phase", icoHandler.CreatePhase)
				ico.GET("/contribution", icoHandler.GetContributions)
			}
			
			futures := admin.Group("/futures")
			{
				futures.GET("/market", futuresHandler.GetMarkets)
				futures.GET("/market/:symbol", futuresHandler.GetMarket)
				futures.POST("/market", futuresHandler.CreateMarket)
				futures.GET("/order", futuresHandler.GetOrders)
				futures.GET("/position", futuresHandler.GetPositions)
			}
			
			ecosystem := admin.Group("/ecosystem")
			{
				ecosystem.GET("/blockchain", ecosystemHandler.GetBlockchains)
				ecosystem.GET("/blockchain/:chain", ecosystemHandler.GetBlockchain)
				ecosystem.PUT("/blockchain/:productId/status", ecosystemHandler.UpdateBlockchainStatus)
				ecosystem.GET("/token", ecosystemHandler.GetTokens)
				ecosystem.GET("/token/:id", ecosystemHandler.GetToken)
				ecosystem.POST("/token", ecosystemHandler.CreateToken)
				ecosystem.PUT("/token/:id", ecosystemHandler.UpdateToken)
				ecosystem.GET("/market", ecosystemHandler.GetMarkets)
				ecosystem.POST("/market", ecosystemHandler.CreateMarket)
				ecosystem.GET("/master-wallet", ecosystemHandler.GetMasterWallets)
				ecosystem.GET("/master-wallet/:id", ecosystemHandler.GetMasterWallet)
				ecosystem.POST("/master-wallet", ecosystemHandler.CreateMasterWallet)
				ecosystem.GET("/custodial-wallet", ecosystemHandler.GetCustodialWallets)
				ecosystem.POST("/custodial-wallet", ecosystemHandler.CreateCustodialWallet)
			}
			
			ecommerce := admin.Group("/ecommerce")
			{
				ecommerce.GET("/category", ecommerceHandler.GetCategories)
				ecommerce.POST("/category", ecommerceHandler.CreateCategory)
				ecommerce.GET("/product", ecommerceHandler.GetProducts)
				ecommerce.GET("/product/:id", ecommerceHandler.GetProduct)
				ecommerce.POST("/product", ecommerceHandler.CreateProduct)
				ecommerce.PUT("/product/:id", ecommerceHandler.UpdateProduct)
				ecommerce.GET("/order", ecommerceHandler.GetOrders)
				ecommerce.GET("/order/:id", ecommerceHandler.GetOrder)
				ecommerce.PUT("/order/:id/status", ecommerceHandler.UpdateOrderStatus)
				ecommerce.GET("/review", ecommerceHandler.GetReviews)
				ecommerce.GET("/discount", ecommerceHandler.GetDiscounts)
				ecommerce.POST("/discount", ecommerceHandler.CreateDiscount)
			}
			
			affiliate := admin.Group("/affiliate")
			{
				affiliate.GET("/condition", affiliateHandler.GetConditions)
				affiliate.POST("/condition", affiliateHandler.CreateCondition)
				affiliate.PUT("/condition/:id", affiliateHandler.UpdateCondition)
				affiliate.GET("/referral", affiliateHandler.GetReferrals)
				affiliate.PUT("/referral/:id/status", affiliateHandler.UpdateReferralStatus)
				affiliate.GET("/reward", affiliateHandler.GetRewards)
				affiliate.POST("/reward", affiliateHandler.CreateReward)
				affiliate.PUT("/reward/:id/status", affiliateHandler.UpdateRewardStatus)
			}
			
			p2p := admin.Group("/p2p")
			{
				p2p.GET("/payment-method", p2pHandler.GetPaymentMethods)
				p2p.POST("/payment-method", p2pHandler.CreatePaymentMethod)
				p2p.GET("/offer", p2pHandler.GetOffers)
				p2p.GET("/offer/:id", p2pHandler.GetOffer)
				p2p.PUT("/offer/:id/status", p2pHandler.UpdateOfferStatus)
				p2p.GET("/trade", p2pHandler.GetTrades)
				p2p.PUT("/trade/:id/status", p2pHandler.UpdateTradeStatus)
				p2p.GET("/dispute", p2pHandler.GetDisputes)
				p2p.PUT("/dispute/:id/resolve", p2pHandler.ResolveDispute)
			}
			
			staking := admin.Group("/staking")
			{
				staking.GET("/pool", stakingHandler.GetPools)
				staking.GET("/pool/:id", stakingHandler.GetPool)
				staking.POST("/pool", stakingHandler.CreatePool)
				staking.PUT("/pool/:id", stakingHandler.UpdatePool)
				staking.GET("/duration", stakingHandler.GetDurations)
				staking.POST("/duration", stakingHandler.CreateDuration)
				staking.GET("/stake", stakingHandler.GetStakes)
				staking.GET("/stake/:id", stakingHandler.GetStake)
				staking.PUT("/stake/:id/release", stakingHandler.ReleaseStake)
			}
			
			mailwizard := admin.Group("/mailwizard")
			{
				mailwizard.GET("/template", mailwizardHandler.GetTemplates)
				mailwizard.GET("/template/:id", mailwizardHandler.GetTemplate)
				mailwizard.POST("/template", mailwizardHandler.CreateTemplate)
				mailwizard.PUT("/template/:id", mailwizardHandler.UpdateTemplate)
				mailwizard.DELETE("/template/:id", mailwizardHandler.DeleteTemplate)
				mailwizard.GET("/campaign", mailwizardHandler.GetCampaigns)
				mailwizard.GET("/campaign/:id", mailwizardHandler.GetCampaign)
				mailwizard.POST("/campaign", mailwizardHandler.CreateCampaign)
				mailwizard.PUT("/campaign/:id", mailwizardHandler.UpdateCampaign)
				mailwizard.DELETE("/campaign/:id", mailwizardHandler.DeleteCampaign)
				mailwizard.POST("/campaign/:id/send", mailwizardHandler.SendCampaign)
			}
			
			ai := admin.Group("/ai")
			{
				ai.GET("/plan", aiHandler.GetPlans)
				ai.GET("/plan/:id", aiHandler.GetPlan)
				ai.POST("/plan", aiHandler.CreatePlan)
				ai.PUT("/plan/:id", aiHandler.UpdatePlan)
				ai.GET("/duration", aiHandler.GetDurations)
				ai.POST("/duration", aiHandler.CreateDuration)
				ai.GET("/investment", aiHandler.GetInvestments)
				ai.GET("/investment/:id", aiHandler.GetInvestment)
				ai.POST("/investment", aiHandler.CreateInvestment)
				ai.PUT("/investment/:id", aiHandler.UpdateInvestment)
				ai.POST("/investment/:id/status", aiHandler.UpdateInvestmentStatus)
				ai.DELETE("/investment/:id", aiHandler.DeleteInvestment)
			}
			
			forex := admin.Group("/forex")
			{
				forex.GET("/plan", forexHandler.GetPlans)
				forex.GET("/plan/:id", forexHandler.GetPlan)
				forex.POST("/plan", forexHandler.CreatePlan)
				forex.PUT("/plan/:id", forexHandler.UpdatePlan)
				forex.GET("/account", forexHandler.GetAccounts)
				forex.POST("/account", forexHandler.CreateAccount)
				forex.GET("/investment", forexHandler.GetInvestments)
				forex.GET("/investment/:id", forexHandler.GetInvestment)
				forex.POST("/investment", forexHandler.CreateInvestment)
				forex.PUT("/investment/:id", forexHandler.UpdateInvestment)
				forex.POST("/investment/:id/status", forexHandler.UpdateInvestmentStatus)
				forex.DELETE("/investment/:id", forexHandler.DeleteInvestment)
				forex.GET("/signal", forexHandler.GetSignals)
				forex.POST("/signal", forexHandler.CreateSignal)
			}
		}

		contentRoutes := api.Group("/content")
		{
			contentRoutes.GET("/blog/post", contentBlogHandler.GetPosts)
			contentRoutes.GET("/blog/post/:slug", contentBlogHandler.GetPost)
			contentRoutes.GET("/blog/category", contentBlogHandler.GetCategories)
			contentRoutes.GET("/blog/tag", contentBlogHandler.GetTags)
			contentRoutes.POST("/blog/post/:postId/comment", contentBlogHandler.CreateComment)
			contentRoutes.GET("/blog/post/:postId/comment", contentBlogHandler.GetComments)
		}

		systemRoutes := auth.Group("/system")
		{
			systemRoutes.POST("/database/backup", systemDatabaseHandler.CreateBackup)
			systemRoutes.GET("/database/backup", systemDatabaseHandler.GetBackups)
			systemRoutes.POST("/database/migrate", systemDatabaseHandler.RunMigration)
			systemRoutes.GET("/database/migrate/status", systemDatabaseHandler.GetMigrationStatus)
			systemRoutes.GET("/database/stats", systemDatabaseHandler.GetDatabaseStats)
		}
	}

	router.GET("/api/exchange/order", adminHandlers.HandleOrderWebSocket(hub))
	router.GET("/api/exchange/market", adminHandlers.HandleMarketWebSocket(hub))

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: router,
	}

	go func() {
		log.Infof("Server starting on port %d", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Info("Server exited")
}
