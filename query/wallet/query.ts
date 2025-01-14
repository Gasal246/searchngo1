import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWalletDetails, getWalletTransactions } from "./functions";
import { QUERY_KEYS } from "../querykeys";

export const useGetWalletInfo = () => {
    return useMutation({
        mutationFn: async ({ token }: { token: string }) => await getWalletDetails(token)
    })
}

export const useGetWalletTransactions = () => {
    return useMutation({
        mutationFn: async ({ token, walletId }: { token: string, walletId: string }) => await getWalletTransactions(token, walletId) 
    })
}

