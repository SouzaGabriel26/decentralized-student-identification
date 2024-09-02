import prismaClient from '@/lib/prismaClient';
import { User } from '@prisma/client';

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  publicKey: string;
  cryptedPrivateKey: string;
};

type CreateUserOutput = {
  id: string;
  name: string;
  email: string;
};

class UserRepository {
  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    return await prismaClient.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        publicKey: true,
        cryptedPrivateKey: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    return await prismaClient.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        publicKey: true,
        cryptedPrivateKey: true,
      },
    });
  }

  async create(input: CreateUserInput): Promise<CreateUserOutput> {
    return await prismaClient.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.passwordHash,
        publicKey: input.publicKey,
        cryptedPrivateKey: input.cryptedPrivateKey,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
