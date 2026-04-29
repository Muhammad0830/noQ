import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updatePrices() {
  console.log("Starting price update to Uzbekistan Sum...");

  // Realistic UZS price range for all services
  const minPrice = 50000;
  const maxPrice = 150000;

  try {
    // Get all services
    const services = await prisma.service.findMany();

    console.log(`Found ${services.length} services to update`);

    let updatedCount = 0;

    const step = 1000;
    const countSteps = Math.floor((maxPrice - minPrice) / step) + 1;

    for (const service of services) {
      // Generate a realistic price in UZS ending with 000
      const randomStep = Math.floor(Math.random() * countSteps);
      const newPrice = minPrice + randomStep * step;

      console.log(
        `Updating ${service.name} from ${service.price} to ${newPrice} UZS`,
      );

      // Update the service
      await prisma.service.update({
        where: { id: service.id },
        data: { price: newPrice },
      });

      updatedCount++;
    }

    console.log(
      `Successfully updated ${updatedCount} services to Uzbekistan Sum (range: ${minPrice} - ${maxPrice})`,
    );
  } catch (error) {
    console.error("Error updating prices:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updatePrices()
  .then(() => {
    console.log("Price update completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Price update failed:", error);
    process.exit(1);
  });
