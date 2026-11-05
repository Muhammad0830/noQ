import { ShopRepositoryInterface } from
    "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { UpdateShopUseCaseInput, UpdateShopUseCaseInterface } from
    "@/application/shop/interfaces/UpdateShopUseCaseInterface.js";
import { StorageServiceInterface } from
    "@/application/shared/interfaces/StorageServiceInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { MulterFile } from "@/types.js";

export class UpdateShopUseCase implements UpdateShopUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly storageService: StorageServiceInterface,
    ) { }

    async execute(input: UpdateShopUseCaseInput): Promise<void> {
        const shopId = ShopId.create(input.id);

        const shop = await this.shopRepository.findById(shopId);

        shop.updateName(input.name);
        shop.updateDescription(input.description);
        shop.updatePhoneNumber(input.phoneNumber);
        shop.updateAddress(input.address);
        shop.updateLogoUrl(input.logoURL);

        if (input.file) {
            const fileName = await this.updateBackgroundImageUrl(
                input.file,
                shop.getBackgroundImageUrl()
            );

            shop.updateBackgroundImageUrl(fileName);
        }

        await this.shopRepository.save(shop);
    }

    private async updateBackgroundImageUrl(
        file: MulterFile,
        prevBackgroundImageUrl: string | null
    ): Promise<string> {
        const shopImagesPath = this.storageService.shopImagesPath;

        if (prevBackgroundImageUrl?.trim()) {
            const previousUrl = await this.storageService.getImageUrl(
                shopImagesPath,
                prevBackgroundImageUrl
            );

            if (previousUrl) {
                await this.storageService.removeImage(
                    [prevBackgroundImageUrl],
                    shopImagesPath
                )
            }
        }

        return await this.storageService.uploadImage(file, shopImagesPath);
    }
}