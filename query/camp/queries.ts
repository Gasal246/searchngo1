import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../querykeys";
import { getUserCampInternetPackages, validateCampApiFunction } from "./functions";

// export const useGetCampInternetPackages = (token: string) => {
//     return useQuery({
//         queryKey: [QUERY_KEYS.USER_CAMP_INTERNET_PACKAGES],
//         queryFn: async () => await getUserCampInternetPackages(token)
//     })
// }

export const useGetCampInternetPackages = () => {
    return useMutation({
        mutationKey: [QUERY_KEYS.USER_CAMP_INTERNET_PACKAGES],
        mutationFn: async ({ token }: { token: string }) => await getUserCampInternetPackages(token)
    })
}

export const useValidateCamp = () => {
    return useMutation({
        mutationFn: async ({ camp_id, client_mac, token }: { camp_id: any, client_mac: string, token: string }) => validateCampApiFunction(camp_id, client_mac, token)
    })
}

