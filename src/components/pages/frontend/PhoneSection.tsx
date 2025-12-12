import React from 'react';
import Image from 'next/image';

const PhoneSection = () => {
  return (
    <section className="relative bg-black py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Trade on the Go
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-200 max-w-3xl mx-auto px-4">
            Experience seamless trading with our advanced mobile platform. 
            Real-time charts, instant notifications, and secure transactions at your fingertips.
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Desktop: Phone Image with Overlays */}
          <div className="hidden md:block relative">
            <Image
              src="/phonechart.webp"
              alt="Mobile Trading Platform"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            
            {/* Bottom Gradient Overlay - creates the "something is in the way" effect */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/95 to-transparent"></div>
            
            {/* Additional overlay for better effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-black"></div>
            
            {/* Feature Cards Overlaying the Bottom - Desktop Only */}
            <div className="absolute bottom-0 left-0 right-0 pb-4">
              <div className="grid grid-cols-3 gap-8 px-8">
                <div className="bg-black/85 backdrop-blur-sm border border-muted-800 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[#B33F40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-Time Charts</h3>
                  <p className="text-sm text-muted-300">Advanced trading tools with live market data</p>
                </div>
                
                <div className="bg-black/85 backdrop-blur-sm border border-muted-800 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Secure Trading</h3>
                  <p className="text-sm text-muted-300">Bank-level security for all transactions</p>
                </div>
                
                <div className="bg-black/85 backdrop-blur-sm border border-muted-800 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.93 4H9v1H5.93a3 3 0 00-2.12.88L2.1 7.6A1 1 0 012 8v8a1 1 0 00.1.4l1.71 1.72A3 3 0 005.93 19H18.07a3 3 0 002.12-.88L21.9 16.4a1 1 0 00.1-.4V8a1 1 0 00-.1-.4L20.19 5.88A3 3 0 0018.07 5H15V4h3.07a4 4 0 012.83 1.17L22.61 6.9c.37.37.39.95.39 1.1v8c0 .15-.02.73-.39 1.1l-1.71 1.73A4 4 0 0118.07 20H5.93a4 4 0 01-2.83-1.17L1.39 17.1C1.02 16.73 1 16.15 1 16V8c0-.15.02-.73.39-1.1l1.71-1.73z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Instant Alerts</h3>
                  <p className="text-sm text-muted-300">Get notified of market movements instantly</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile: Clean Feature Cards Only */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 gap-6 px-4">
              <div className="bg-black/85 backdrop-blur-sm border border-muted-800 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#B33F40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-Time Charts</h3>
                <p className="text-sm text-muted-300">Advanced trading tools with live market data</p>
              </div>
              
              <div className="bg-black/85 backdrop-blur-sm border border-muted-800 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure Trading</h3>
                <p className="text-sm text-muted-300">Bank-level security for all transactions</p>
              </div>
              
              <div className="bg-black/85 backdrop-blur-sm border border-muted-800 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.93 4H9v1H5.93a3 3 0 00-2.12.88L2.1 7.6A1 1 0 012 8v8a1 1 0 00.1.4l1.71 1.72A3 3 0 005.93 19H18.07a3 3 0 002.12-.88L21.9 16.4a1 1 0 00.1-.4V8a1 1 0 00-.1-.4L20.19 5.88A3 3 0 0018.07 5H15V4h3.07a4 4 0 012.83 1.17L22.61 6.9c.37.37.39.95.39 1.1v8c0 .15-.02.73-.39 1.1l-1.71 1.73A4 4 0 0118.07 20H5.93a4 4 0 01-2.83-1.17L1.39 17.1C1.02 16.73 1 16.15 1 16V8c0-.15.02-.73.39-1.1l1.71-1.73z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Instant Alerts</h3>
                <p className="text-sm text-muted-300">Get notified of market movements instantly</p>
              </div>
            </div>
          </div>
          
          {/* Side glow effects */}
          <div className="absolute top-1/2 left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default PhoneSection;
