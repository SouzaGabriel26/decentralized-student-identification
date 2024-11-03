import { contractAddress } from '@/contract/contract-address';
import { abi } from '@/contract/smart-contract-abi';
import { constants } from '@/utils/constants';
import { randomBytes } from 'crypto';
import { it } from 'vitest';
import {
  ContractExecutionError,
  TransactionRevertWithCustomError,
  Web3,
} from 'web3';

describe('> Smart contract', async () => {
  const ganacheWeb3 = new Web3(constants.ganache_url);
  ganacheWeb3.handleRevert = true;
  const contract = new ganacheWeb3.eth.Contract(abi, contractAddress);
  const accounts = await ganacheWeb3.eth.getAccounts();
  const account = accounts[0].toLocaleLowerCase();

  it('should issue a card, extend expiration time and invalidate', async () => {
    // emitting a card
    const currentDate = new Date();
    const expirationDateInTimestamp = new Date(
      currentDate.setMonth(currentDate.getMonth() + 6),
    ).getTime();

    const mockedHashCard = 'cryptographic hash of the card';

    const address = randomBytes(20).toString('hex');
    const userEthAddress = '0x' + address;

    const card = await contract.methods
      .issueCard(mockedHashCard, expirationDateInTimestamp, userEthAddress)
      .send({
        from: account,
        gas: '3000000',
      });

    expect(card.from).toBe(account);
    expect(card.to).toBe(contractAddress.toLocaleLowerCase());

    // retrieving the card
    const issuedCard = await contract.methods.getCard(userEthAddress).call();
    const { isValid, expDate, hashCard, studentPublicKey } = issuedCard;

    expect(isValid).toBe(true);
    expect(Number(expDate)).toBe(expirationDateInTimestamp);
    expect(hashCard).toBe(mockedHashCard);
    expect(studentPublicKey.toLocaleLowerCase()).toBe(userEthAddress);

    // extending expiration time
    const newExpirationDate = new Date(
      new Date(expirationDateInTimestamp).setMonth(
        new Date(expirationDateInTimestamp).getMonth() + 6,
      ),
    ).getTime();
    await contract.methods
      .extendCardExpiration(userEthAddress, newExpirationDate)
      .send({
        from: account,
        gas: '3000000',
      });

    const issuedCardAfterExtension = await contract.methods
      .getCard(userEthAddress)
      .call();
    const { expDate: newExpDate } = issuedCardAfterExtension;

    expect(Number(newExpDate)).toBeGreaterThan(Number(expDate));

    // invalidating the card
    await contract.methods.invalidateCard(userEthAddress).send({
      from: account,
      gas: '3000000',
    });

    const issuedCardAfterInvalidation = await contract.methods
      .getCard(userEthAddress)
      .call();
    const { isValid: isCardValid } = issuedCardAfterInvalidation;
    expect(isCardValid).toBe(false);
  });

  it('should throw an error because the userEthAddress does not exists', async () => {
    const userEthAddress = '0x' + randomBytes(20).toString('hex');
    let errorMessage = '';

    try {
      await contract.methods.getCard(userEthAddress).call();
    } catch (error) {
      if (error instanceof ContractExecutionError) {
        errorMessage = error.cause.errorArgs!.message as string;
      }
    }

    expect(errorMessage).toBe('Carteira nao encontrada.');
  });

  it('should throw an error because this address already has a card issued', async () => {
    const currentDate = new Date();
    const expirationDateInTimestamp = new Date(
      currentDate.setMonth(currentDate.getMonth() + 6),
    ).getTime();

    const hashCard = 'cryptographic hash of the card';

    const address = randomBytes(20).toString('hex');
    const userEthAddress = '0x' + address;

    const firstCard = await contract.methods
      .issueCard(hashCard, expirationDateInTimestamp, userEthAddress)
      .send({
        from: account,
        gas: '3000000',
      });

    expect(firstCard.from).toBe(account);
    expect(firstCard.to).toBe(contractAddress.toLocaleLowerCase());

    let reason = '';

    try {
      await contract.methods
        .issueCard(hashCard, expirationDateInTimestamp, userEthAddress)
        .send({
          from: account,
          gas: '3000000',
        });
    } catch (error) {
      if (error instanceof TransactionRevertWithCustomError) {
        reason = error.reason;
      }
    }

    expect(reason).toBe(
      'VM Exception while processing transaction: revert Ja existe uma carteira emitida para essa chave publica.',
    );
  });
});
