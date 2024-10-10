import prismaClient from '@/lib/prismaClient';
import { constants } from '@/utils/constants';
import bcrypt from 'bcryptjs';

resetDatabase();

async function resetDatabase() {
  try {
    await prismaClient.user.deleteMany();
    console.log('> Database reseted');

    await createAdminUser();
  } catch (err) {
    console.error('> Error on reset database');
    console.log(err);
  }
}

async function createAdminUser() {
  const SALT_ROUNDS = 2;
  try {
    const { admin_email, admin_raw_password } = constants.seed;
    const hashedPassword = bcrypt.hashSync(admin_raw_password, SALT_ROUNDS);

    await prismaClient.user.create({
      data: {
        name: 'Admin',
        email: admin_email,
        password: hashedPassword,
        role: 'ADMIN',
        ethAddress: '0x',
        publicKey: '0x',
        status: 'APPROVED',
      },
    });

    console.log(`> Admin user created: ${admin_email}\n`);
  } catch {
    console.error('> Error on create admin user');
    process.exit(1);
  }
}
