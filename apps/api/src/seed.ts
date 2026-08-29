import { PrismaClient, Role, HostelType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create Super Admin
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('admin123', salt);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@hostel.com' },
    update: {},
    create: {
      email: 'admin@hostel.com',
      password,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log({ superAdmin });

  // Create Demo Hostel
  let hostel = await prisma.hostel.findFirst({ where: { name: 'Alpha Boys Hostel' } });
  if (!hostel) {
    hostel = await prisma.hostel.create({
      data: {
        name: 'Alpha Boys Hostel',
        type: HostelType.BOYS,
        capacity: 100,
        blocks: {
          create: [
            {
              name: 'Block A',
              floorCount: 2,
              floors: {
                create: [
                  {
                    number: 1,
                    rooms: {
                      create: [
                        {
                          number: '101',
                          capacity: 2,
                          beds: {
                            create: [{ number: '101-A' }, { number: '101-B' }],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }

  console.log({ hostel });

  // Create Demo Student
  const studentPassword = await bcrypt.hash('student123', salt);
  const student = await prisma.user.upsert({
    where: { email: 'student@hostel.com' },
    update: {},
    create: {
      email: 'student@hostel.com',
      password: studentPassword,
      role: Role.STUDENT,
      student: {
        create: {
          studentId: 'STU202601',
          name: 'John Doe',
          department: 'Computer Science',
          year: 2,
        },
      },
    },
  });

  console.log({ student });
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
