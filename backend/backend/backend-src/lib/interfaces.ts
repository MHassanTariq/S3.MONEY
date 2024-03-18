// TODO: use this properly, for type checking
export interface ICreatePackageRequest {
  // creator's address
  address: string
  // coin metadata
  ticker: string // short name, usually five or fewer characters (uppercase)
  decimals: number
  name: string
  icon_url?: string
  // for supply-constrainted contracts
  initialSupply?: string // can be "0"
  maxSupply?: string // can be "0"
  // set internally
  packageName?: string
  description?: string
}

export interface IPackageCreated {
  address: string
  ticker: string
  created: boolean
  // sent if created is true
  txid?: string
  data?: object
  // set internally for cancel case
  packageName?: string
}

export interface IValid {
  error: string
  data?: object
}
