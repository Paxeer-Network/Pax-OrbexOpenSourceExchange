import Head from 'next/head'
import Layout from '@/layouts/Default'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDashboardStore } from '@/stores/dashboard'
import Card from '@/components/elements/base/card/Card'
import Button from '@/components/elements/base/button/Button'
// Badge component will be handled differently
import { Icon } from '@iconify/react'

const NFTWatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useDashboardStore()

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/nft/watchlist', {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.status) {
        setWatchlist(data.data || [])
      } else {
        toast.error('Failed to load watchlist')
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      toast.error('Failed to load watchlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = async (nftId: string) => {
    try {
      const response = await fetch(`/api/user/nft/watchlist/${nftId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.status) {
        setWatchlist(prev => prev.filter((item: any) => item.nft_id !== nftId))
        toast.success('Removed from watchlist')
      } else {
        toast.error('Failed to remove from watchlist')
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      toast.error('Failed to remove from watchlist')
    }
  }

  return (
    <Layout title="NFT Watchlist" color="muted">
      <Head>
        <title>NFT Watchlist</title>
        <meta name="description" content="Manage your NFT watchlist" />
        <meta name="keywords" content="nft, watchlist, collectibles, crypto" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-muted-900 dark:text-white">
              NFT Watchlist
            </h1>
            <p className="text-muted-500 dark:text-muted-400">
              Keep track of your favorite NFTs
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-500">
            <Icon icon="lucide:heart" className="h-4 w-4" />
            <span>{watchlist.length} items watched</span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse">
                  <div className="aspect-square bg-muted-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted-200 rounded mb-2"></div>
                  <div className="h-3 bg-muted-200 rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : watchlist.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted-100 dark:bg-muted-800 flex items-center justify-center">
              <Icon icon="lucide:heart" className="h-8 w-8 text-muted-400" />
            </div>
            <h3 className="text-lg font-semibold text-muted-900 dark:text-white mb-2">
              No NFTs in watchlist
            </h3>
            <p className="text-muted-500 dark:text-muted-400 mb-6">
              Start exploring and add NFTs to your watchlist to keep track of them
            </p>
            <Button variant="outlined" onClick={() => window.location.href = '/user/nft'}>
              <Icon icon="lucide:eye" className="mr-2 h-4 w-4" />
              Explore NFTs
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((item: any) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.nft?.image || '/img/placeholder.png'}
                    alt={item.nft?.name || 'NFT'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="outlined"
                      className="h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40"
                      onClick={() => removeFromWatchlist(item.nft_id)}
                    >
                      <Icon icon="lucide:heart-off" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-muted-900 dark:text-white">
                        {item.nft?.name || 'Unnamed NFT'}
                      </h3>
                      <p className="text-sm text-muted-500 dark:text-muted-400">
                        {item.nft?.collection || 'Unknown Collection'}
                      </p>
                    </div>
                  </div>
                  
                  {item.nft?.price && (
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-500">Price</p>
                        <p className="font-semibold text-muted-900 dark:text-white">
                          {item.nft.price} {item.nft.currency}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${item.nft.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.nft.status}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Icon icon="lucide:external-link" className="mr-2 h-4 w-4" />
                      View NFT
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default NFTWatchlistPage
