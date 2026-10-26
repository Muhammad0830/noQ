import { GetShopListUseCaseOutput } from "@/application/shop/interfaces/GetShopListUseCaseInterface.js";

export function toShopListResource(output: GetShopListUseCaseOutput) {
    const shops = output.shops.map(shop => ({
        id: shop.getId().toString(),
        ownerId: shop.getOwnerId().toString(),
        categoryId: shop.getCategory().getId().toString(),
        name: shop.getName(),
        isOpen: shop.isOpen(),
        address: shop.getAddress(),
        createdAt: shop.getCreatedAt().getValue(),
        updatedAt: shop.getUpdatedAt().getValue(),
        description: shop.getDescription(),
        loooUrl: shop.getLogoUrl(),
        phone: shop.getPhoneNumber(),
        backgroundImageUrl: shop.getBackgroundImageUrl(),
    }))

    const services = output.services.map(service => ({
        id: service.getId().toString(),
        shopId: service.getShopId(),
        name: service.getName(),
        isActive: service.isActive(),
        price: service.getPrice().amount,
        duration: service.getDuration(),
        bufferTime: service.getBufferTime(),
        description: service.getDescription(),
        createdAt: service.getCreatedAt().getValue(),
        updatedAt: service.getUpdatedAt().getValue(),
    }))

    return { shops, services };
}