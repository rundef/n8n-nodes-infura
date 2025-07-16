import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class Infura implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Infura',
    name: 'infura',
    icon: 'file:infura.svg',
    group: ['blockchain'],
    version: 1,
    description: 'Interact with Infura Ethereum API',
    defaults: {
      name: 'Infura',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'infuraApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Network',
        name: 'network',
        type: 'options',
        options: [
          { name: 'Ethereum Mainnet', value: 'mainnet' },
          { name: 'Hoodi Testnet', value: 'hoodi' },
					{ name: 'Sepolia Testnet', value: 'sepolia' }
        ],
        default: 'mainnet',
        description: 'Which Ethereum network to use',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
				noDataExpression: true,
        options: [
					{ name: 'Contract Call', value: 'call', description: 'Call smart contract (read-only)', action: 'Call smart contract read only',},
          { name: 'Get Balance', value: 'getBalance', description: 'Get ETH balance for address', action: 'Get ETH balance for address',},
          { name: 'Get Block by Number', value: 'getBlockByNumber', description: 'Fetch block details', action: 'Fetch block details',},
          { name: 'Get Gas Price', value: 'getGasPrice', description: 'Get current gas price', action: 'Get current gas price',},
          { name: 'Get Logs', value: 'getLogs', description: 'Query contract logs/events', action: 'Query contract logs events',},
          { name: 'Get Transaction by Hash', value: 'getTxByHash', description: 'Get transaction details', action: 'Get transaction details',},
          { name: 'Send Raw Transaction', value: 'sendRawTx', description: 'Send signed transaction', action: 'Send signed transaction',},
        ],
        default: 'getBalance',
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        displayOptions: {
          show: { operation: ['getBalance', 'getLogs'] },
        },
        default: '',
        description: 'Ethereum address',
        required: true,
      },
      {
        displayName: 'Block Number',
        name: 'blockNumber',
        type: 'string',
        displayOptions: {
          show: { operation: ['getBlockByNumber'] },
        },
        default: 'latest',
        description: 'Block number (decimal or "latest")',
      },
      {
        displayName: 'Transaction Hash',
        name: 'txHash',
        type: 'string',
        displayOptions: {
          show: { operation: ['getTxByHash'] },
        },
        default: '',
      },
      {
        displayName: 'Logs: From Block',
        name: 'logsFromBlock',
        type: 'string',
        displayOptions: {
          show: { operation: ['getLogs'] },
        },
        default: 'latest',
        description: 'Start block (e.g. "0x1" or "latest")',
      },
      {
        displayName: 'Logs: To Block',
        name: 'logsToBlock',
        type: 'string',
        displayOptions: {
          show: { operation: ['getLogs'] },
        },
        default: 'latest',
        description: 'End block (e.g. "latest")',
      },
      {
        displayName: 'Logs: Topic0',
        name: 'logsTopic0',
        type: 'string',
        displayOptions: {
          show: { operation: ['getLogs'] },
        },
        default: '',
        description: 'First topic (event signature hash)',
      },
      {
        displayName: 'Contract Call: To Address',
        name: 'callTo',
        type: 'string',
        displayOptions: {
          show: { operation: ['call'] },
        },
        default: '',
        description: 'Contract address',
      },
      {
        displayName: 'Contract Call: Data',
        name: 'callData',
        type: 'string',
        displayOptions: {
          show: { operation: ['call'] },
        },
        default: '',
        description: 'ABI-encoded data (use ethers.js to encode)',
      },
      {
        displayName: 'Raw Transaction Data',
        name: 'rawTx',
        type: 'string',
        displayOptions: {
          show: { operation: ['sendRawTx'] },
        },
        default: '',
        description: 'Raw signed transaction data (0x...)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('infuraApi');
    const items = this.getInputData();

    const network = this.getNodeParameter('network', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    const projectId = credentials.projectId as string;

    const baseUrl = `https://${network}.infura.io/v3/${projectId}`;

    let responses: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      let body: any = { jsonrpc: '2.0', id: 1, method: '', params: [] };

      try {
        if (operation === 'getBalance') {
          const address = this.getNodeParameter('address', i) as string;
          body.method = 'eth_getBalance';
          body.params = [address, 'latest'];
        } else if (operation === 'getBlockByNumber') {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          body.method = 'eth_getBlockByNumber';
          body.params = [
            isNaN(Number(blockNumber))
              ? blockNumber
              : '0x' + Number(blockNumber).toString(16),
            true,
          ];
        } else if (operation === 'getTxByHash') {
          const txHash = this.getNodeParameter('txHash', i) as string;
          body.method = 'eth_getTransactionByHash';
          body.params = [txHash];
        } else if (operation === 'getLogs') {
          const address = this.getNodeParameter('address', i) as string;
          const fromBlock = this.getNodeParameter('logsFromBlock', i) as string;
          const toBlock = this.getNodeParameter('logsToBlock', i) as string;
          const topic0 = this.getNodeParameter('logsTopic0', i) as string;
          const filter: any = {
            address,
            fromBlock,
            toBlock,
          };
          if (topic0) {
            filter.topics = [topic0];
          }
          body.method = 'eth_getLogs';
          body.params = [filter];
        } else if (operation === 'call') {
          const to = this.getNodeParameter('callTo', i) as string;
          const data = this.getNodeParameter('callData', i) as string;
          body.method = 'eth_call';
          body.params = [
            { to, data },
            'latest',
          ];
        } else if (operation === 'getGasPrice') {
          body.method = 'eth_gasPrice';
          body.params = [];
        } else if (operation === 'sendRawTx') {
          const rawTx = this.getNodeParameter('rawTx', i) as string;
          body.method = 'eth_sendRawTransaction';
          body.params = [rawTx];
        } else {
          throw new NodeOperationError(this.getNode(), 'Unknown operation selected.');
        }

        const response = await this.helpers.request({
          method: 'POST',
          url: baseUrl,
          body,
          json: true,
        });
        responses.push({ json: response });
      } catch (err) {
        throw new NodeOperationError(this.getNode(), err, { itemIndex: i });
      }
    }

    return [responses];
  }
}
