import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLocation } from "./functions";

export const useFetchLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ssid: string) => fetchLocation(ssid)
    })
}

