import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { supabaseServer } from "../src/services/supabaseServer.js";

const prisma = new PrismaClient();

async function createSupabaseUser(
  email: string,
  password: string,
  name: string,
  phoneNumber: string,
) {
  const { data, error } = await supabaseServer.auth.admin.createUser({
    email,
    password,
    phone: phoneNumber,
    email_confirm: true,
    user_metadata: {
      name,
    },
  });

  if (error || !data.user) {
    throw new Error(
      `Supabase createUser failed for ${email}: ${error?.message ?? "no user returned"}`,
    );
  }

  return data.user;
}

async function main() {
  console.log("Starting database seeding...");

  // Fetch existing shop categories
  const categories = await prisma.shopCategory.findMany();
  if (categories.length === 0) {
    throw new Error(
      "No shop categories found. Please ensure categories exist in the database.",
    );
  }
  console.log(`Found ${categories.length} shop categories`);

  // Create users (owners, staff, customers) and sync with Supabase auth
  const users = [];
  for (let i = 0; i < 50; i++) {
    const email = faker.internet.email().toLowerCase();
    const name = faker.person.fullName();
    const phoneNumber = `+9989${faker.number.int({ min: 100000000, max: 999999999 })}`;
    const password = faker.internet.password({
      length: 12,
      memorable: false,
    });

    const authUser = await createSupabaseUser(
      email,
      password,
      name,
      phoneNumber,
    );

    const user = await prisma.user.create({
      data: {
        id: authUser.id,
        email,
        name,
        avatarUrl: faker.image.avatar(),
        phoneNumber,
        role: faker.helpers.arrayElement(["USER", "ADMIN"]),
      },
    });
    users.push(user);
  }
  console.log(`Created ${users.length} users`);

  // Create shops
  const shops = [];
  for (let i = 0; i < 5; i++) {
    const owner = faker.helpers.arrayElement(users);
    const category = faker.helpers.arrayElement(categories);
    const shop = await prisma.shop.create({
      data: {
        id: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        logoUrl: faker.image.url(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        categoryId: category.id,
        ownerId: owner.id,
        backgroundImageUrl: faker.image.url(),
      },
    });
    shops.push(shop);
  }
  console.log(`Created ${shops.length} shops`);

  // Create services for each shop
  const barberServices = [
    { name: "Hair Cut", price: 80000, durationMin: 45 },
    { name: "Beard Trim", price: 30000, durationMin: 20 },
    { name: "Hair Wash", price: 25000, durationMin: 15 },
    { name: "Shave", price: 40000, durationMin: 30 },
    { name: "Hair Styling", price: 60000, durationMin: 40 },
    { name: "Facial", price: 70000, durationMin: 50 },
    { name: "Head Massage", price: 35000, durationMin: 25 },
  ];

  const services = [];
  for (const shop of shops) {
    const numServices = faker.number.int({ min: 5, max: 6 });
    const selectedServices = faker.helpers.arrayElements(
      barberServices,
      numServices,
    );
    for (const serviceData of selectedServices) {
      const service = await prisma.service.create({
        data: {
          id: faker.string.uuid(),
          name: serviceData.name,
          description: faker.lorem.sentence(),
          price: serviceData.price,
          durationMin: serviceData.durationMin,
          shopId: shop.id,
          bufferTime: faker.number.int({ min: 0, max: 30 }),
        },
      });
      services.push(service);
    }
  }
  console.log(`Created ${services.length} services`);

  // Create staff for each shop
  const staffs = [];
  for (const shop of shops) {
    const staffUsers = faker.helpers.arrayElements(
      users,
      faker.number.int({ min: 2, max: 4 }),
    );
    for (const user of staffUsers) {
      const staff = await prisma.staff.create({
        data: {
          id: faker.string.uuid(),
          userId: user.id,
          shopId: shop.id,
          role: faker.helpers.arrayElement(["OWNER", "MANAGER", "STAFF"]),
        },
      });
      staffs.push(staff);
    }
  }
  console.log(`Created ${staffs.length} staffs`);

  // Create shop schedules for each shop (7 days)
  const shopSchedules = [];
  for (const shop of shops) {
    for (let day = 0; day < 7; day++) {
      const schedule = await prisma.shopSchedule.create({
        data: {
          id: faker.string.uuid(),
          shopId: shop.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
          type: "OPEN",
        },
      });
      shopSchedules.push(schedule);
    }
  }
  console.log(`Created ${shopSchedules.length} shop schedules`);

  // Create bookings from last month to today
  const today = new Date();
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  );
  const bookings = [];
  const daysDiff = Math.ceil(
    (today.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24),
  );

  for (let dayOffset = 0; dayOffset <= daysDiff; dayOffset++) {
    const date = new Date(lastMonth);
    date.setDate(lastMonth.getDate() + dayOffset);

    for (const shop of shops) {
      const shopServices = services.filter((s) => s.shopId === shop.id);
      const shopStaffs = staffs.filter((s) => s.shopId === shop.id);
      const numBookings = faker.number.int({ min: 3, max: 4 });

      for (let i = 0; i < numBookings; i++) {
        const customer = faker.helpers.arrayElement(users);
        const service = faker.helpers.arrayElement(shopServices);
        const staff = faker.helpers.maybe(
          () => faker.helpers.arrayElement(shopStaffs),
          { probability: 0.7 },
        );

        const startHour = faker.number.int({ min: 9, max: 17 });
        const startTime = new Date(date);
        startTime.setHours(startHour, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + service.durationMin);

        const booking = await prisma.booking.create({
          data: {
            id: faker.string.uuid(),
            userId: customer.id,
            shopId: shop.id,
            serviceId: service.id,
            startTime,
            endTime,
            status: faker.helpers.arrayElement([
              "PENDING",
              "CONFIRMED",
              "COMPLETED",
              "CANCELLED",
            ]),
            staffId: staff?.id ?? null,
          },
        });
        bookings.push(booking);
      }
    }
  }
  console.log(`Created ${bookings.length} bookings`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
