import { predeploys } from '@eth-optimism/contracts-ts'
import { useMemo } from 'react'
import type { Config } from 'wagmi'
import { useConfig } from 'wagmi'

import { deploymentAddresses } from '../configs/deploymentAddresses'
import type { NetworkType } from '../types'
import { useOPNetwork } from './useOPNetwork'

export type UseOPWagmiConfigArgs = {
  type: NetworkType
}

export const useOPWagmiConfig = ({ type }: UseOPWagmiConfigArgs) => {
  const config = useConfig()
  const { networkPair } = useOPNetwork({ type })

  const opConfig = useMemo<Config | undefined>(() => {
    if (!networkPair) {
      return
    }

    const { l1, l2 } = networkPair
    const deploymentAddress = deploymentAddresses[l2.id]

    return {
      ...config,
      l2chains: {
        [l2.id]: {
          chainId: l2.id,
          l1ChainId: l1.id,
          l1Addresses: {
            portal: {
              address: deploymentAddress.OptimismPortalProxy,
              chainId: l1.id,
            },
            l2OutputOracle: {
              address: deploymentAddress.L2OutputOracleProxy,
              chainId: l1.id,
            },
            l1StandardBridge: {
              address: deploymentAddress.L1StandardBridgeProxy,
              chainId: l1.id,
            },
            l1CrossDomainMessenger: {
              address: deploymentAddress.L1CrossDomainMessengerProxy,
              chainId: l1.id,
            },
            l1Erc721Bridge: {
              address: deploymentAddress.L1ERC721BridgeProxy,
              chainId: l1.id,
            },
          },
          l2Addresses: {
            l2L1MessagePasserAddress: {
              address: predeploys.L2ToL1MessagePasser,
              chainId: l2.id,
            },
            l2StandardBridge: {
              address: predeploys.L2StandardBridge,
              chainId: l2.id,
            },
          },
        },
      },
    } as Config // we typecase to Config here, because op-wagmi for now is missing the OpConfig export
  }, [config, networkPair])

  return { opConfig }
}