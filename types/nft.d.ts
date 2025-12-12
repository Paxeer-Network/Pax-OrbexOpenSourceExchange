type FetchCollectionsParams = Record<string, string | number | boolean> & {
  minPrice?: string | number;
  maxPrice?: string | number;
  sortBy?: string;
  order?: string;
  limit?: string;
  offset?: string;
};

interface NftCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  floorPrice: number;
  holders: number;
  totalVolume: number;
  totalSales: number;
  chain: string;
  views: number;
  links: {
    website: string;
    youtube: string;
    twitter: string;
    instagram: string;
    discord: string;
    telegram: string;
  };
  followers: number;
  createdAt: Date;
  creator: Creator;
  nftAssets: any[];
  nftCount: number;
  analytics: {
    volumePerDay: { date: string; volume: number }[];
    tradesPerDay: { date: string; trades: number }[];
    averageSalePricePerDay: { date: string; averagePrice: number }[];
    ownerDistribution: { [owner: string]: number };
  };
}

interface TrendingCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  views: number;
  creator: Creator;
}

interface FeaturedNftCollection {
  id: string;
  name: string;
  description: string;
  creator: Creator;
  floorPrice: number;
  volume: number;
  trades: number;
  owners: number;
}

interface TopCollection {
  id: string;
  name: string;
  image: string;
  volume: number;
  startingPrice: number;
}

interface Creator {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Collection {
  id: string;
  name: string;
  views: number;
}

interface NftAsset {
  id: string;
  name: string;
  image: string;
  price: number;
  index: number;
  likes: number;
  createdAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  collection: {
    id: string;
    name: string;
    description: string;
    chain: string;
    views: number;
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      avatar: string;
    };
  };
}

interface FeaturedNftAsset {
  id: string;
  name: string;
  image: string;
  price: number;
  index: number;
  rank: number;
}

type FetchAssetsParams = Record<string, string | number | boolean> & {
  collectionId?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  minPrice?: string | number;
  maxPrice?: string | number;
  limit?: number;
  offset?: number;
};

interface NftAuction {
  id: string;
  startTime: string;
  endTime: string;
  startingBid: number;
  highestBid: number;
  nftAsset: {
    id: string;
    name: string;
    image: string;
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      avatar: string;
    };
  };
}

interface FetchTopCreatorsParams {
  search?: string;
  minNftCount?: number;
  sortBy?: string;
  order?: string;
  limit?: number;
  offset?: number;
}

interface TopCreators {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  nftCount: number;
  totalSales: number;
  popularity: number;
  followersCount: number;
}
