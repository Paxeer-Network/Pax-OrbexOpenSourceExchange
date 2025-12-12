import Head from 'next/head'
import Layout from '@/layouts/Default'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDashboardStore } from '@/stores/dashboard'
import Card from '@/components/elements/base/card/Card'
import Button from '@/components/elements/base/button/Button'
import { formatDistanceToNow } from 'date-fns'
import { Icon } from '@iconify/react'

const NFTOffersPage = () => {
  const [offers, setOffers] = useState({ made: [], received: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('made')
  const { profile } = useDashboardStore()

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/nft/offer', {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.status) {
        setOffers(data.data || { made: [], received: [] })
      } else {
        toast.error('Failed to load offers')
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
      toast.error('Failed to load offers')
    } finally {
      setLoading(false)
    }
  }

  const handleOffer = async (offerId: string, action: 'accept' | 'reject' | 'cancel') => {
    try {
      const response = await fetch(`/api/user/nft/offer/${offerId}/${action}`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.status) {
        toast.success(`Offer ${action}ed successfully`)
        fetchOffers()
      } else {
        toast.error(`Failed to ${action} offer`)
      }
    } catch (error) {
      console.error(`Error ${action}ing offer:`, error)
      toast.error(`Failed to ${action} offer`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="flex items-center gap-1">
          <Icon icon="lucide:clock" className="h-3 w-3" />
          Pending
        </div>
      case 'accepted':
        return <div className="flex items-center gap-1">
          <Icon icon="lucide:check-circle" className="h-3 w-3" />
          Accepted
        </div>
      case 'rejected':
        return <div className="flex items-center gap-1">
          <Icon icon="lucide:x-circle" className="h-3 w-3" />
          Rejected
        </div>
      case 'expired':
        return <div className="flex items-center gap-1">
          <Icon icon="lucide:alert-circle" className="h-3 w-3" />
          Expired
        </div>
      default:
        return <div>{status}</div>
    }
  }

  const EmptyState = ({ type }: { type: 'made' | 'received' }) => (
    <Card className="p-12 text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted-100 dark:bg-muted-800 flex items-center justify-center">
        {type === 'made' ? 
          <Icon icon="lucide:trending-up" className="h-8 w-8 text-muted-400" /> : 
          <Icon icon="lucide:trending-down" className="h-8 w-8 text-muted-400" />
        }
      </div>
      <h3 className="text-lg font-semibold text-muted-900 dark:text-white mb-2">
        No {type} offers
      </h3>
      <p className="text-muted-500 dark:text-muted-400 mb-6">
        {type === 'made' 
          ? "You haven't made any offers yet. Start exploring NFTs to make your first offer."
          : "You haven't received any offers yet. List your NFTs to start receiving offers."
        }
      </p>
      <Button variant="outlined" onClick={() => window.location.href = '/user/nft'}>
        {type === 'made' ? 'Explore NFTs' : 'List NFTs'}
      </Button>
    </Card>
  )

  const OfferCard = ({ offer, type }: { offer: any, type: 'made' | 'received' }) => (
    <Card key={offer.id} className="p-4">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted-100 dark:bg-muted-800 flex-shrink-0">
          <img
            src={offer.nft_image || '/img/placeholder.png'}
            alt={offer.nft_name || 'NFT'}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-muted-900 dark:text-white">
                {offer.nft_name || 'Unnamed NFT'}
              </h3>
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {offer.collection || 'Unknown Collection'}
              </p>
            </div>
            {getStatusBadge(offer.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-muted-500">Offer Amount</p>
              <p className="font-semibold text-muted-900 dark:text-white">
                <Icon icon="lucide:dollar-sign" className="inline h-4 w-4 mr-1" />
                {offer.offer_amount} {offer.currency}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-500">
                {type === 'made' ? 'To' : 'From'}
              </p>
              <p className="font-medium text-muted-900 dark:text-white">
                <Icon icon="lucide:user" className="inline h-4 w-4 mr-1" />
                {type === 'made' 
                  ? offer.recipient_username || 'Unknown' 
                  : offer.offerer_username || 'Unknown'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-500">
              <Icon icon="lucide:calendar" className="h-4 w-4 mr-1" />
              {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
              {offer.expires_at && (
                <span className="ml-2">
                  • Expires {formatDistanceToNow(new Date(offer.expires_at), { addSuffix: true })}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              {type === 'made' && offer.status === 'pending' && (
                <Button 
                  size="sm" 
                  variant="outlined"
                  onClick={() => handleOffer(offer.id, 'cancel')}
                >
                  Cancel
                </Button>
              )}
              
              {type === 'received' && offer.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    variant="outlined"
                    onClick={() => handleOffer(offer.id, 'reject')}
                  >
                    Reject
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleOffer(offer.id, 'accept')}
                  >
                    Accept
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <Layout title="NFT Offers" color="muted">
      <Head>
        <title>NFT Offers</title>
        <meta name="description" content="Manage your NFT offers" />
        <meta name="keywords" content="nft, offers, trading, marketplace" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-muted-900 dark:text-white">
              NFT Offers
            </h1>
            <p className="text-muted-500 dark:text-muted-400">
              Manage your incoming and outgoing NFT offers
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="grid w-full grid-cols-2 border-b">
            <button 
              onClick={() => setActiveTab('made')}
              className={`flex items-center gap-2 p-3 ${activeTab === 'made' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            >
              <Icon icon="lucide:trending-up" className="h-4 w-4" />
              Made Offers ({offers.made?.length || 0})
            </button>
            <button 
              onClick={() => setActiveTab('received')}
              className={`flex items-center gap-2 p-3 ${activeTab === 'received' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            >
              <Icon icon="lucide:trending-down" className="h-4 w-4" />
              Received Offers ({offers.received?.length || 0})
            </button>
          </div>

          {activeTab === 'made' && (<div className="space-y-4 mt-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="animate-pulse flex gap-4">
                      <div className="w-16 h-16 bg-muted-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted-200 rounded mb-2"></div>
                        <div className="h-3 bg-muted-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : offers.made.length === 0 ? (
              <EmptyState type="made" />
            ) : (
              <div className="space-y-4">
                {offers.made.map((offer: any) => (
                  <OfferCard key={offer.id} offer={offer} type="made" />
                ))}
              </div>
            )}
          </div>)}

          {activeTab === 'received' && (<div className="space-y-4 mt-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="animate-pulse flex gap-4">
                      <div className="w-16 h-16 bg-muted-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted-200 rounded mb-2"></div>
                        <div className="h-3 bg-muted-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : offers.received.length === 0 ? (
              <EmptyState type="received" />
            ) : (
              <div className="space-y-4">
                {offers.received.map((offer: any) => (
                  <OfferCard key={offer.id} offer={offer} type="received" />
                ))}
              </div>
            )}
          </div>)}
        </div>
      </div>
    </Layout>
  )
}

export default NFTOffersPage
