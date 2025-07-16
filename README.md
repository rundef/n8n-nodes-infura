# n8n-nodes-infura ⚡️🪙

This is an n8n community node. It lets you use Infura in your n8n workflows.

Infura is a scalable API gateway for Ethereum, IPFS, and other decentralized protocols providing instant, reliable access to blockchain data and infrastructure.

> Infura is a trademark of Consensys Software Inc. This project is not affiliated with or endorsed by Consensys.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)
[Compatibility](#compatibility)  
[Resources](#resources)

 ## 🚀 Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## ⚙️ Operations

This node currently supports:

- 🏦 eth_getBalance: Get ETH balance for any address

- ⛓️ eth_getBlockByNumber: Fetch details of a specific block

- 🔎 eth_getTransactionByHash: Retrieve transaction details

- 📰 eth_getLogs: Query contract logs/events

- 📞 eth_call: Read smart contract state (read-only)

- ⛽ eth_gasPrice: Get the current gas price

- 🚀 eth_sendRawTransaction: Send a signed transaction

## 🔑 Credentials

To use this node:

- [Sign up for Infura](https://infura.io/)
- Create a new project to get your Project ID
- In n8n, add new credentials for "Infura API" and enter your project details

## 🧩 Compatibility

- Minimum n8n version: 1.0.0
- Tested with: n8n 1.97.x and above
- No known incompatibilities


## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
