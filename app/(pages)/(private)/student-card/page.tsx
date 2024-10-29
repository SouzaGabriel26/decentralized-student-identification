import { abi } from '@/contract/smart-contract-abi';
import { constants } from '@/utils/constants';
import { identity } from '@/utils/idendity';
import { Box, Text } from '@primer/react';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { Web3 } from 'web3';
import { StudentCard } from './components/StudentCard';

export default async function Page() {
  const signedUser = await identity.getMe();
  if (!signedUser || signedUser.role === 'ADMIN') {
    return redirect('/', RedirectType.replace);
  }

  if (signedUser.status !== 'APPROVED') {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          gap: 2,
        }}
      >
        <Text>Carteira de estudante não disponível.</Text>
        <Link href="/student-card/status">Ver status</Link>
      </Box>
    );
  }

  const web3 = new Web3(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
  );

  const contract = new web3.eth.Contract(abi, constants.smart_contract_address);

  const studentCard = await contract.methods
    .getCard(signedUser.ethAddress)
    .call();

  return (
    <>
      <Link
        target={process.env.NODE_ENV === 'production' ? '_blank' : '_self'}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
        href={
          process.env.NODE_ENV === 'production'
            ? `https://sepolia.etherscan.io/tx/${signedUser.transactionHash}`
            : '#'
        }
      >
        Ver transação na blockchain
      </Link>
      <StudentCard
        ethAddress={signedUser.ethAddress}
        userId={signedUser.id}
        studentCard={{
          expDate: Number(studentCard.expDate),
          hashCard: studentCard.hashCard,
          isValid: studentCard.isValid,
          studentPublicKey: studentCard.studentPublicKey,
        }}
      />
    </>
  );
}
