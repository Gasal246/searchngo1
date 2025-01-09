import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserMembershipDetails, purchaseNewMembership } from "./functions";

export type order_status = '0' | '1' | '2' | '3'

export const useGetUserMembershipDetails = () => {
    return useMutation({
        mutationFn: async ({ token, status }: { token: string, status?: order_status }) => getUserMembershipDetails(token, status)
    })
}

export const usePurchaseNewMembership = () => {
    return useMutation({
        mutationFn: async ({ payload, token }: { payload: any, token: string }) => purchaseNewMembership(payload, token)
    })
}
