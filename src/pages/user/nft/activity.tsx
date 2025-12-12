import Head from 'next/head'
import Layout from '@/layouts/Default'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDashboardStore } from '@/stores/dashboard'
import Card from '@/components/elements/base/card/Card'
import Button from '@/components/elements/base/button/Button'
// Badge and Select will be replaced with native HTML elements
import { Icon } from '@iconify/react'
import { formatDistanceToNow } from 'date-fns'

const NFTActivityPage = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const { profile } = useDashboardStore()

  useEffect(() => {
    fetchActivity()
  }, [filter, page])

  const fetchActivity = async (loadMore = false) => {
    try {
      if (!loadMore) setLoading(true)
      
      const params = new URLSearchParams({
        type: filter,
        limit: '20',
        offset: String(((loadMore ? page : 1) - 1) * 20)
      })
      
      const response = await fetch(`/api/user/nft/activity?${params}`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.status) {
        const newActivities = data.data.activities || []
        setActivities(loadMore ? [...activities, ...newActivities] : newActivities)
        setHasMore(data.data.hasMore || false)
        setTotal(data.data.total || 0)
      } else {
        toast.error('Failed to load activity')
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
      toast.error('Failed to load activity')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
    fetchActivity(true)
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setPage(1)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Icon icon="lucide:shopping-bag" className="h-5 w-5 text-green-500" />
      case 'sale':
        return <Icon icon="lucide:dollar-sign" className="h-5 w-5 text-blue-500" />
      case 'transfer':
        return <Icon icon="lucide:send" className="h-5 w-5 text-purple-500" />
      case 'listing':
        return <Icon icon="lucide:file-text" className="h-5 w-5 text-orange-500" />
      case 'offer':
        return <Icon icon="lucide:trending-up" className="h-5 w-5 text-yellow-500" />
      default:
        return <Icon icon="lucide:activity" className="h-5 w-5 text-muted-500" />
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'purchase':
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Purchase</span>
      case 'sale':
        return <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">Sale</span>
      case 'transfer':
        return <span className="px-2 py-1 text-xs rounded bg-cyan-100 text-cyan-800">Transfer</span>
      case 'listing':
        return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Listing</span>
      case 'offer':
        return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">Offer</span>
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">{type}</span>
    }
  }

  const ActivityCard = ({ activity }: { activity: any }) => (
    <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted-100 dark:bg-muted-800 flex-shrink-0 flex items-center justify-center">
          {activity.nft_image ? (
            <img
              src={activity.nft_image}
              alt={activity.nft_name || 'NFT'}
              className="w-full h-full object-cover"
            />
          ) : (
            getActivityIcon(activity.type)
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-muted-900 dark:text-white">
                {activity.nft_name || 'Unnamed NFT'}
              </h3>
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {activity.collection || 'Unknown Collection'}
              </p>
            </div>
            {getActivityBadge(activity.type)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            {activity.amount && (
              <div>
                <p className="text-sm text-muted-500">Amount</p>
                <p className="font-semibold text-muted-900 dark:text-white">
                  <Icon icon="lucide:dollar-sign" className="inline h-4 w-4 mr-1" />
                  {activity.amount} {activity.currency}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-muted-500">From</p>
              <p className="font-medium text-muted-900 dark:text-white">
                <Icon icon="lucide:user" className="inline h-4 w-4 mr-1" />
                {activity.from_username || 'Unknown'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-500">To</p>
              <p className="font-medium text-muted-900 dark:text-white">
                <Icon icon="lucide:user" className="inline h-4 w-4 mr-1" />
                {activity.to_username || 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-500">
              <div className="flex items-center">
                <Icon icon="lucide:calendar" className="h-4 w-4 mr-1" />
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </div>
              
              {activity.transaction_hash && (
                <div className="flex items-center">
                  <Icon icon="lucide:hash" className="h-4 w-4 mr-1" />
                  <span className="font-mono text-xs">
                    {activity.transaction_hash.slice(0, 8)}...{activity.transaction_hash.slice(-6)}
                  </span>
                </div>
              )}
            </div>
            
            {activity.transaction_hash && (
              <Button 
                size="sm" 
                variant="outlined"
                onClick={() => window.open(`https://etherscan.io/tx/${activity.transaction_hash}`, '_blank')}
              >
                <Icon icon="lucide:external-link" className="h-4 w-4 mr-1" />
                View Tx
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <Layout title="NFT Activity" color="muted">
      <Head>
        <title>NFT Activity</title>
        <meta name="description" content="View your NFT transaction history and activity" />
        <meta name="keywords" content="nft, activity, transactions, history" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-muted-900 dark:text-white">
              NFT Activity
            </h1>
            <p className="text-muted-500 dark:text-muted-400">
              Track all your NFT transactions and activities
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-500">
            <Icon icon="lucide:activity" className="h-4 w-4" />
            <span>{total} total activities</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:filter" className="h-4 w-4 text-muted-500" />
            <span className="text-sm text-muted-500">Filter by:</span>
          </div>
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Activity</option>
            <option value="purchase">Purchases</option>
            <option value="sale">Sales</option>
            <option value="transfer">Transfers</option>
            <option value="listing">Listings</option>
            <option value="offer">Offers</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse flex gap-4">
                  <div className="w-12 h-12 bg-muted-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted-200 rounded mb-2"></div>
                    <div className="h-3 bg-muted-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted-200 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted-100 dark:bg-muted-800 flex items-center justify-center">
              <Icon icon="lucide:activity" className="h-8 w-8 text-muted-400" />
            </div>
            <h3 className="text-lg font-semibold text-muted-900 dark:text-white mb-2">
              No activity found
            </h3>
            <p className="text-muted-500 dark:text-muted-400 mb-6">
              {filter === 'all' 
                ? "You haven't had any NFT activity yet. Start trading to see your history here."
                : `No ${filter} activities found. Try a different filter or start trading.`
              }
            </p>
            <Button variant="outlined" onClick={() => window.location.href = '/user/nft'}>
              <Icon icon="lucide:activity" className="mr-2 h-4 w-4" />
              Explore NFTs
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: any) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
            
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outlined" 
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default NFTActivityPage
