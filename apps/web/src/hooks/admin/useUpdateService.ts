import { Service } from "@noq/shared";
import useApiQuery from "../useApiQuery";
import { useApiMutation } from "../useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";

export interface UpdateServicePayload {
    id: string;
    shopId: string;
    name: string;
    price: number;
    durationMin: number;
    bufferTime?: number;
    selectedStaffs: string[];
}

export interface UpdateServiceResponse {
    message: string;
}

interface Props {
    serviceId: string;
    shopId: string | undefined;
}

export function useUpdateService({
    shopId,
    serviceId,
}: Props) {
    const { data: service, isLoading, isError, error } = useApiQuery<Service>(
        API_ENDPOINTS.serviceById(serviceId),
        { key: ["service", serviceId] }
    )

    const { mutateAsync: updateService, isPending: isUpdating } =
        useApiMutation<UpdateServiceResponse, UpdateServicePayload>(
            () => `${API_ENDPOINTS.admin.services}/${serviceId}`,
            "put",
            { headers: { "x-shop-id": shopId } }
        );

    const { mutateAsync: deleteService, isPending: isDeleting } =
        useApiMutation<{ message: string }>(
            () => `${API_ENDPOINTS.admin.services}/${serviceId}`,
            "delete",
            { headers: { "x-shop-id": shopId } }
        );

    return {
        service,
        isLoading,
        isError,
        error,

        updateService,
        deleteService,

        isUpdating,
        isDeleting,
    }
}