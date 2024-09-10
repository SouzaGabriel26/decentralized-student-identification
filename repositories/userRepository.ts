import prismaClient from '@/lib/prismaClient';
import { User } from '@prisma/client';

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  publicKey: string;
};

type CreateUserOutput = {
  id: string;
  name: string;
  email: string;
};

type CreatePendingDataInput = {
  name: string;
  email: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  course: string;
  photoUrl: string;
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
        status: true,
        createdAt: true,
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
        status: true,
        createdAt: true,
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
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async createPendingData(userId: string, input: CreatePendingDataInput) {
    return await prismaClient.userPendingData.create({
      data: {
        userId,
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        cep: input.cep,
        address: input.address,
        number: input.number,
        complement: input.complement,
        course: input.course,
        photoUrl: input.photoUrl,
      },
      select: {
        name: true,
        email: true,
        userId: true,
        id: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
