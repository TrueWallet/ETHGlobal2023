export const environment = {
    fbAppId: '237695028950110',
    factorySC: '0x03A3cF69a09b5B59CDaa84a5cE3a011AC373541c',
    entrypointSC: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    rpcProviderUrl: 'https://polygon-mumbai.g.alchemy.com/v2/WXSmdVbcyuSc65MiBjHseEy9iBbxUW99',
    stackupProviderUrl: 'https://api.stackup.sh/v1/node/cafbe5ac145ac879db48465f34e79da65dcc9c5f384dd414fa2945aa22c8559f',
    stackuPaymasterConfig: {
      rpcUrl: "https://api.stackup.sh/v1/paymaster/cafbe5ac145ac879db48465f34e79da65dcc9c5f384dd414fa2945aa22c8559f",
      context: {
       type: "payg"
    }
  },
  supportedERC20: [
    {
      ticker: 'DERC20',
      name: 'Dummy ERC20',
      address: '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
      decimals: 18,
      icon: null
    },
    {
      ticker: 'USDT',
      name: 'Tether USD',
      address: '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832',
      decimals: 6,
      icon: null
    },
    {
      ticker: 'USDC',
      name: 'USD Coin',
      address: '0x3870419Ba2BBf0127060bCB37f69A1b1C090992B',
      decimals: 6,
      icon: null
    }
  ]
};
