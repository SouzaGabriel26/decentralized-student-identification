export const abi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_studentPublicKey',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_newExpDate',
        type: 'uint256',
      },
    ],
    name: 'CardExpirationExtended',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_studentPublicKey',
        type: 'address',
      },
    ],
    name: 'CardInvalidated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_studentPublicKey',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_expDate',
        type: 'uint256',
      },
    ],
    name: 'CardIssued',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_studentPublicKey', type: 'address' },
      { internalType: 'uint256', name: '_newExpDate', type: 'uint256' },
    ],
    name: 'extendCardExpiration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_studentPublicKey', type: 'address' },
    ],
    name: 'getCard',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'hashCard', type: 'string' },
          { internalType: 'uint256', name: 'expDate', type: 'uint256' },
          {
            internalType: 'address',
            name: 'studentPublicKey',
            type: 'address',
          },
          { internalType: 'bool', name: 'isValid', type: 'bool' },
        ],
        internalType: 'struct StudentIdentification.StudentCard',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_studentPublicKey', type: 'address' },
    ],
    name: 'invalidateCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_hashCard', type: 'string' },
      { internalType: 'uint256', name: '_expDate', type: 'uint256' },
      { internalType: 'address', name: '_studentPublicKey', type: 'address' },
    ],
    name: 'issueCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalCardsIssued',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
