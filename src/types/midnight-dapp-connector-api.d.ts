declare module '@midnight-ntwrk/midnight-js-network-provider' {
  export type NetworkId = string;
  export class NetworkProvider {
    constructor(config: any);
    submitTransaction(params: {
      contractAddress: string;
      circuit: string;
      proof: string;
      publicInputs: Record<string, string>;
    }): Promise<{ txHash: string }>;
  }
}

declare module '../managed/contract/index.js' {
  export function createContract(): {
    initialize(ownerAddress: string, initialPoolDust: bigint): Promise<void>;
    sponsorFeeIntent(witnesses: any, intentHash: string, maxFee: bigint): Promise<string>;
    [key: string]: any;
  };
  export const contractInfo: {
    name: string;
    circuits: Array<{ name: string; [key: string]: any }>;
    [key: string]: any;
  };
}
