import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InfuraApi implements ICredentialType {
	name = 'infuraApi';
	displayName = 'Infura API';
	documentationUrl = 'https://docs.metamask.io/services/';

	properties: INodeProperties[] = [
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Infura Project ID',
		}
	];
}
