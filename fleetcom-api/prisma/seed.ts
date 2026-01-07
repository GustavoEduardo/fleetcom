import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import cars from './cars.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco...');

  /* ==============================
     USUÁRIO ADMIN
  ============================== */

  const adminEmail = process.env.SEED_USER_EMAIL || '';
  const adminPassword = process.env.SEED_USER_PASSWORD || '';
  const adminName = process.env.SEED_USER_NAME || '';

  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    console.log('✅ Usuário admin criado');
  } else {
    console.log('ℹ️ Usuário admin já existe');
  }

  /* ==============================
     VEÍCULOS INICIAIS
  ============================== */

  const vehicleCount = await prisma.vehicle.count();

  if (vehicleCount === 0) {
    await prisma.vehicle.createMany({
      data: cars.map((car) => ({
        name: car.name,
        year: car.year,
        type: car.type,
        engine: car.engine,
        size: car.size,
        imageUrl: car.imageUrl ?? null,
      })),
    });

    console.log('🚗 Veículos iniciais inseridos');
  } else {
    console.log('ℹ️ Veículos já existem — seed ignorado');
  }

  console.log('🌱 Seed finalizado com sucesso');
}

/* ==============================
   EXECUÇÃO
============================== */

main()
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
