import React, { memo, useEffect, useState } from "react";
import Layout from "@/layouts/Nav";
import { Orderbook } from "@/components/pages/trade/orderbook/Orderbook";
import { Trades } from "@/components/pages/trade/trades";
import { Chart } from "@/components/pages/trade/chart";
import { Markets } from "@/components/pages/trade/markets";
import { Ticker } from "@/components/pages/trade/ticker";
import { Order } from "@/components/pages/trade/order";
import { Orders } from "@/components/pages/trade/orders";
import { Icon } from "@iconify/react";
import useMarketStore from "@/stores/trade/market";
import { useDashboardStore } from "@/stores/dashboard";
import { useRouter } from "next/router";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const TradePage = () => {
  const { market, setWithEco } = useMarketStore();
  const { hasExtension, extensions } = useDashboardStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orderbook');
  const [mobileTab, setMobileTab] = useState('chart');

  useEffect(() => {
    if (router.isReady && extensions) setWithEco(hasExtension("ecosystem"));
  }, [router.isReady, extensions]);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  const switchMobileTab = (tab: string) => {
    setMobileTab(tab);
  };

  return (
    <Layout
      title={market?.symbol || "Connecting..."}
      color="muted"
      horizontal
      darker
    >
      <div className="flex flex-col">
        {/* Ticker Bar */}
        <div className="min-h-[8vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-1">
          <Ticker />
        </div>
        
        {/* Desktop Layout - Resizable Panels */}
        <div className="hidden lg:block mt-1 mb-5" style={{minHeight: 'calc(100vh - 120px)', height: 'calc(100vh + 200px)'}}>
          <PanelGroup direction="vertical">
            {/* Top Panel Group - Chart | Order Book/Trades | Order Entry */}
            <Panel defaultSize={70} minSize={50}>
              <PanelGroup direction="horizontal">
                {/* Chart Panel */}
                <Panel defaultSize={60} minSize={30}>
                  <div className="h-full bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 mr-1">
                    <Chart />
                  </div>
                </Panel>
                
                <PanelResizeHandle className="resizable-handle resizable-handle-vertical" />
                
                {/* Order Book/Trades Panel */}
                <Panel defaultSize={25} minSize={20}>
                  <div className="h-full flex flex-col bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 mx-1">
                    {/* Tab Headers */}
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                      <button 
                        onClick={() => switchTab('orderbook')}
                        className={`modern-tab-button flex-1 ${
                          activeTab === 'orderbook' ? 'active' : 'inactive'
                        }`}
                      >
                        Order Book
                      </button>
                      <button 
                        onClick={() => switchTab('trades')}
                        className={`modern-tab-button flex-1 ${
                          activeTab === 'trades' ? 'active' : 'inactive'
                        }`}
                      >
                        Trades
                      </button>
                      <button 
                        onClick={() => switchTab('markets')}
                        className={`modern-tab-button flex-1 ${
                          activeTab === 'markets' ? 'active' : 'inactive'
                        }`}
                      >
                        Markets
                      </button>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="flex-1 relative min-h-0">
                      <div className={`absolute inset-0 overflow-auto ${activeTab === 'orderbook' ? 'block' : 'hidden'}`}>
                        <Orderbook />
                      </div>
                      <div className={`absolute inset-0 overflow-auto ${activeTab === 'trades' ? 'block' : 'hidden'}`}>
                        <Trades />
                      </div>
                      <div className={`absolute inset-0 overflow-auto ${activeTab === 'markets' ? 'block' : 'hidden'}`}>
                        <Markets />
                      </div>
                    </div>
                  </div>
                </Panel>
                
                <PanelResizeHandle className="resizable-handle resizable-handle-vertical" />
                
                {/* Order Entry Panel */}
                <Panel defaultSize={15} minSize={15}>
                  <div className="h-full bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 ml-1">
                    <div className="w-full h-full overflow-auto">
                      <Order />
                    </div>
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>
            
            <PanelResizeHandle className="resizable-handle resizable-handle-horizontal my-1" />
            
            {/* Order History Panel */}
            <Panel defaultSize={30} minSize={20}>
              <div className="h-full">
                <Orders />
              </div>
            </Panel>
          </PanelGroup>
        </div>
        
        {/* Mobile Layout - Tab Based */}
        <div className="lg:hidden flex flex-col flex-1">
          {/* Mobile Content Area */}
          <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg" style={{height: 'calc(100vh - 16vh)'}}>
            {/* Chart Tab */}
            {mobileTab === 'chart' && (
              <div className="w-full h-full relative">
                <div className="absolute inset-0">
                  <Chart />
                </div>
              </div>
            )}
            

            
            {/* Trade Tab */}
            {mobileTab === 'trade' && (
              <div className="w-full h-full overflow-auto p-4 bg-white dark:bg-zinc-950">
                <Order />
              </div>
            )}
            
            {/* Book Tab */}
            {mobileTab === 'book' && (
              <div className="w-full h-full bg-white dark:bg-zinc-950">
                <div className="h-full flex flex-col">
                  {/* Mobile Tab Headers */}
                  <div className="flex border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                    <button 
                      onClick={() => setActiveTab('orderbook')}
                      className={`modern-tab-button flex-1 ${
                        activeTab === 'orderbook' ? 'active' : 'inactive'
                      }`}
                    >
                      Order Book
                    </button>
                    <button 
                      onClick={() => setActiveTab('trades')}
                      className={`modern-tab-button flex-1 ${
                        activeTab === 'trades' ? 'active' : 'inactive'
                      }`}
                    >
                      Trades
                    </button>
                    <button 
                      onClick={() => setActiveTab('markets')}
                      className={`modern-tab-button flex-1 ${
                        activeTab === 'markets' ? 'active' : 'inactive'
                      }`}
                    >
                      Markets
                    </button>
                  </div>
                  
                  {/* Mobile Tab Content */}
                  <div className="flex-1 relative min-h-0">
                    <div className={`absolute inset-0 overflow-auto ${activeTab === 'orderbook' ? 'block' : 'hidden'}`}>
                      <Orderbook />
                    </div>
                    <div className={`absolute inset-0 overflow-auto ${activeTab === 'trades' ? 'block' : 'hidden'}`}>
                      <Trades />
                    </div>
                    <div className={`absolute inset-0 overflow-auto ${activeTab === 'markets' ? 'block' : 'hidden'}`}>
                      <Markets />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Orders Tab */}
            {mobileTab === 'orders' && (
              <div className="w-full h-full overflow-auto bg-white dark:bg-zinc-950">
                <Orders />
              </div>
            )}
          </div>
          
          {/* Mobile Bottom Tab Navigation */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950" style={{height: '8vh'}}>
            <div className="flex h-full">
              {/* Chart Tab */}
              <button
                onClick={() => switchMobileTab('chart')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                  mobileTab === 'chart'
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon icon="mdi:chart-line" className="h-5 w-5" />
                <span className="text-xs font-medium">Chart</span>
              </button>
              

              
              {/* Trade Tab */}
              <button
                onClick={() => switchMobileTab('trade')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                  mobileTab === 'trade'
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon icon="mdi:swap-horizontal" className="h-5 w-5" />
                <span className="text-xs font-medium">Trade</span>
              </button>
              
              {/* Book Tab */}
              <button
                onClick={() => switchMobileTab('book')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                  mobileTab === 'book'
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon icon="mdi:book-open-variant" className="h-5 w-5" />
                <span className="text-xs font-medium">Book</span>
              </button>
              
              {/* Orders Tab */}
              <button
                onClick={() => switchMobileTab('orders')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                  mobileTab === 'orders'
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon icon="mdi:format-list-bulleted" className="h-5 w-5" />
                <span className="text-xs font-medium">Orders</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default memo(TradePage);
