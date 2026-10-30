import { GetShopListUseCaseOutput } from "@/application/shop/interfaces/GetShopListUseCaseInterface.js";

export function toShopListResource(output: GetShopListUseCaseOutput) {
    const services = output.services.map(service => ({
        id: service.getId().toString(),
        shopId: service.getShopId(),
        name: service.getName(),
        isActive: service.isActive(),
        price: service.getPrice().amount,
        durationMin: service.getDurationMin(),
        bufferTime: service.getBufferTime(),
        description: service.getDescription(),
        createdAt: service.getCreatedAt().getValue(),
        updatedAt: service.getUpdatedAt().getValue(),
    }))

    return { shops: output.shops.shopList, services };
}