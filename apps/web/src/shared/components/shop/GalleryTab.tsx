import Image from "next/image";
import { Dispatch, FC, SetStateAction } from "react";

interface GalleryTabProps {
    backgroundImage: string | null;
    imageLoadError: boolean;
    shopName: string;
    setImageLoadError: Dispatch<SetStateAction<boolean>>;
}

const GalleryTab: FC<GalleryTabProps> = ({
    backgroundImage,
    imageLoadError,
    shopName,
    setImageLoadError,
}) => {
    return (
        <div className="grid grid-cols-3 gap-4 relative">
            {backgroundImage && !imageLoadError && (
                <div className="col-span-3 aspect-video relative">
                    <Image
                        src={backgroundImage}
                        alt={shopName}
                        onError={() => setImageLoadError(true)}
                        fill
                        className="w-full object-cover rounded-lg"
                    />
                </div>
            )}
        </div>
    );
}

export default GalleryTab;