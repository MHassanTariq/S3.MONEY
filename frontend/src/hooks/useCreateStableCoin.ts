import { SuiSignAndExecuteTransactionBlockOutput } from '@mysten/wallet-standard';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { ApiManager } from '@/services/api';

const createApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/create'
);
const cancelApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/cancel'
);
const publishedApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/published'
);

export enum suiNetworkList {
  localnet = 'localnet',
  devnet = 'devnet',
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export interface CreateStableCoinData {
  walletAddress: string;
  packageName: string;
  ticker: string;
  decimals: number;
  name?: string | undefined;
  description?: string | undefined;
  maxSupply?: number;
  initialSupply?: number;
  network?: suiNetworkList;
  icon?: string;
}

export interface CreateStableCoinApiPostResponse {
  modules: number[][] | string[];
  dependencies: string[];
}

export interface RemoveNotPublishedStableCoinData {
  walletAddress: string;
  ticker: string;
}

export interface RemoveNotPublishedStableCoinApiPostResponse {
  status: string;
  message: string;
}

export interface SavePublishedStableCoinData {
  walletAddress: string;
  ticker: string;
  transactionID: string;
  data: SuiSignAndExecuteTransactionBlockOutput;
}

export interface SavePublishedStableCoinApiPostResponse {
  status: string;
  packages: SuiSignAndExecuteTransactionBlockOutput[];
}

export const useCreateStableCoin = () => ({
  create: useMutation({
    mutationFn: async ({
      walletAddress,
      packageName,
      ticker,
      name,
      description,
      decimals,
      maxSupply,
      initialSupply,
      network = suiNetworkList.testnet,
      icon,
    }: CreateStableCoinData) => createApi.post({
      address: walletAddress,
      packageName,
      ticker,
      name,
      description,
      decimals,
      maxSupply,
      initialSupply,
      network,
      icon_url: icon,
    })
      .then((response: AxiosResponse<CreateStableCoinApiPostResponse>) => response.data),
  }),
  removeNotPublishedStableCoin: useMutation({
    mutationFn: async ({
      walletAddress,
      ticker,
    }: RemoveNotPublishedStableCoinData) => cancelApi.post({
      address: walletAddress,
      ticker,
      created: false,
    })
      .then((response: AxiosResponse<RemoveNotPublishedStableCoinApiPostResponse>) => response.data),
  }),
  savePublishedStableCoin: useMutation({
    mutationFn: async ({
      walletAddress,
      ticker,
      transactionID,
      data,
    }: SavePublishedStableCoinData) => publishedApi.post({
      address: walletAddress,
      ticker,
      txid: transactionID,
      created: true,
      data,
    })
      .then((response: AxiosResponse<SavePublishedStableCoinApiPostResponse>) => response.data),
  }),
});
