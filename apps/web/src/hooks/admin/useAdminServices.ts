import { ApiResponse, BasicService } from "@noq/shared";
import useApiQuery from "../useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { useApiMutation } from "../useApiMutation";
import { AxiosError } from "axios";
import { UseMutateFunction } from "@tanstack/react-query";

export interface UseAdminServicesType {
    services: BasicService[],
    isLoading: boolean,
    isError: boolean,
    error: AxiosError | null,
    refetch: () => void,
    activateService: UseMutateFunction<ApiResponse<unknown>, Error, {
        id: string;
    }, unknown>
    deactivateService: UseMutateFunction<ApiResponse<unknown>, Error, {
        id: string;
    }, unknown>
    isUpdating: (id: string) => boolean;
    activationError: Error | null
    deactivationError: Error | null
}

export function useAdminServices({
    shopId,
}: { shopId: string | undefined }): UseAdminServicesType {
    const {
        data: services = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useApiQuery<BasicService[]>(
        `${API_ENDPOINTS.admin.services}?shopId=${shopId}`,
        {
            key: ["admin-services", `${shopId}`],
            enabled: !!shopId,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            headers: {
                "x-shop-id": shopId ?? '',
            },
        },
    );

    const activateServiceMutation = useApiMutation<unknown, { id: string }>(
        ({ id }) => API_ENDPOINTS.admin.activateService(id),
        "put",
        () => ({ headers: { "x-shop-id": shopId ?? '' } }));

    const deactivateServiceMutation = useApiMutation<unknown, { id: string }>(
        ({ id }) => API_ENDPOINTS.admin.deactivateService(id),
        "put",
        () => ({ headers: { "x-shop-id": shopId ?? '' } }));

    const isUpdating = (id: string): boolean => {
        const isActivating = activateServiceMutation.isPending && activateServiceMutation.variables?.id === id;
        const isDeactivating = deactivateServiceMutation.isPending && deactivateServiceMutation.variables?.id === id;

        if (isActivating || isDeactivating) {
            return true;
        }

        return false;
    }

    return {
        services,
        isLoading,
        isError,
        error,
        refetch,
        activateService: activateServiceMutation.mutate,
        deactivateService: deactivateServiceMutation.mutate,
        isUpdating,
        activationError: activateServiceMutation.error,
        deactivationError: deactivateServiceMutation.error,
    }
}