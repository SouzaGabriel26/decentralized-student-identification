import { abi } from '@/contract/smart-contract-abi';
import { bytecode } from '@/contract/smart-contract-bytecode';
import { constants } from '@/utils/constants';
import fs from 'fs';
import { Web3 } from 'web3';

async function deploy() {
  const web3 = new Web3(constants.ganache_url);
  const accounts = await web3.eth.getAccounts();

  console.log('Deploying from account: ', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '2000000' });

  const contractAddress = result.options.address;
  console.log('Contract deployed to: ', contractAddress);

  fs.writeFileSync(
    './contract/contract-address.ts',
    `export const contractAddress = '${contractAddress}';
`,
  );
}

deploy();
