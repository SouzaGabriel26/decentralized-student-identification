import prismaClient from '@/lib/prismaClient';
import { createUserRepository } from '@/repositories/userRepository';
import { createUpdatePendingDataUseCase } from '@/useCases/updatePendingDataUseCase';
import { randomUUID } from 'crypto';

beforeAll(async () => {
  await prismaClient.user.deleteMany();
});

describe('> Update Pending Data Use Case', () => {
  it('should return a error when send at least one invalid input field', async () => {
    const userRepository = createUserRepository();
    const { updatePendingDataUseCase } =
      createUpdatePendingDataUseCase(userRepository);

    const createdUser = await userRepository.create({
      name: 'user_to_update_use_case',
      email: 'user_to_update_use_case@mail.com',
      ethAddress: randomUUID(),
      passwordHash: randomUUID(),
      publicKey: randomUUID(),
    });

    const createdPendingData = await userRepository.createPendingData(
      createdUser.id,
      {
        name: createdUser.name,
        email: createdUser.email,
        address: 'Test',
        cep: '12345678',
        cpf: '12345678911',
        course: 'ciencia-da-computacao',
        number: '123',
        complement: 'Complement',
        photoUrl: 'https://test.com/photo.jpg',
      },
    );

    // The input will always expect a full object because it will
    // be provided by the form data (update-profile).
    const updatedPendingDat = await updatePendingDataUseCase({
      id: createdPendingData.id,
      dataToUpdate: {
        address: 'Test',
        cep: '12345678',
        cpf: '12345678911',
        course: 'invalid-course',
        number: '123',
        complement: 'Complement',
        photoUrl: 'https://test.com/photo.jpg',
      },
    });

    expect(updatedPendingDat.data).toBeNull();
    expect(updatedPendingDat.errors![0].path).toStrictEqual(['course']);
  });
});
