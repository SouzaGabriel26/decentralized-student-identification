# Blockchain Student Identification, through smart contracts

This project implements a decentralized system for managing student identification cards using Ethereum smart contracts. The smart contract allows the owner (institution) to issue, invalidate, and extend student cards. It uses a mapping to associate each student’s public key with their identification card details, providing a secure, transparent, and immutable way to handle sensitive student data.

The student's card details are encrypted using the student's public key. This ensures that only the holder of the corresponding private key can decrypt and access the details, safeguarding the confidentiality of the information.

## Content shortcuts

- [Stack](#stack)
- [References](#references)
- [Features](#features)
- [Demonstrations](#demonstrations)
- [How to run](#how-to-run)
- [Author](#author)

## References

- [Ethereum development documentation](https://ethereum.org/en/developers/docs/)
- [Solidity documentation](https://soliditylang.org/)
- [Web3.js documentation](https://docs.web3js.org/)

## Stack

[NextJS](https://nextjs.org/docs), [@primer/react](https://primer.style/), [ganache](https://github.com/trufflesuite/ganache), [prisma](https://www.prisma.io/), [Web3.js](https://docs.web3js.org/), [Solidity](https://soliditylang.org/).

## Features (smart-contract based)

click to see [`smart-contract`](https://github.com/SouzaGabriel26/student-identification/blob/main/contract/smart-contract.sol) source code.

**Issue Student Card:**

- The `issueCard` function allows the contract owner to issue a student card by providing a card hash, expiration date, and the student's public key. An event CardIssued is emitted once the card is successfully issued.

**Get Student Card:**

- The `getCard` function allows anyone to retrieve the details of a student card using the student's public key. If no card is found, an error is thrown.

**Invalidate Student Card:**

- The `invalidateCard` function marks a student card as invalid, preventing further use. This can only be done by the contract owner, and an event CardInvalidated is emitted.

**Extend Card Expiration:**

- The `extendCardExpiration` function extends the expiration date of an existing student card, ensuring that the new expiration date is greater than the current one. An event CardExpirationExtended is emitted.

## Demonstrations

[Flowchart showing how the project is structured](https://app.eraser.io/workspace/xxmg2mphVZfFWwK0kStY?origin=share)

> User Registering

[01-register-flow.webm](https://github.com/user-attachments/assets/00a6ba7e-735e-4804-8617-557a309de75f)

> Admin rejecting user's request

[02-admin-reject-user-flow.webm](https://github.com/user-attachments/assets/e61ab0b7-45b7-484b-87f6-13f77edab251)

> Admin approving user's request

[03-admin-approve-user-flow.webm](https://github.com/user-attachments/assets/001b7af1-858b-4e73-a50b-295e25342e25)

> Admin extending user's card expiration time

[04-admin-extend-expiration-time.webm](https://github.com/user-attachments/assets/159b7ccb-ea53-4932-a4d9-69356320c63c)

> Admin invalidatin user's card

[05-admin-invalidate-user-card.webm](https://github.com/user-attachments/assets/a68a93a1-5411-4703-9f9f-ceea221f7ea1)

> User decrypting card

[06-user-decrypting-card.webm](https://github.com/user-attachments/assets/728899c9-f850-44a5-a4e9-b917ef32a9e6)

> User forgot private key

[07-user-forgot-private-key.webm](https://github.com/user-attachments/assets/0b242ee2-1063-4bf2-9ff5-c0b99ac4eb07)

## How to run

> ATTENTION: To run this project locally, you must have docker installed on your machine.

### First, create a .env file based on .env.example

```bash
cp .env.example .env
```

> :warning: To run the project with all the features, you would need a lambda function using the [presigned urls](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html) strategy. And then add the `function_url` to `LAMBDA_FUNCTION_URL` env. If you really want to run the project, [contact me](https://www.linkedin.com/in/souzagabriel26/).

> The lambda function structure can be followed [here](https://github.com/SouzaGabriel26/student-identification/blob/main/tests/services/mock/Lambda.js).

### If you are running the project for the first time, paste this command into your terminal:

```bash
pnpm project:setup
```

- This command will:
  1. install project dependencies;
  2. compose up docker conteiner;
  3. wait for the conteiner up;
  4. run migrations.

#### To run the project, paste this command into your terminal:

```bash
pnpm dev:all
```

- This command will:
  1. start ganache local server (concurrently in terminal)
  2. deploy the smart contract on ganache local server (it will save the contract address in a file)
  3. compose up docker conteiner;
  4. wait for conteiner;
  5. run the development server.

## Author

- [@SouzaGabriel26](https://www.github.com/souzagabriel26)
