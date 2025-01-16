import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialUpdateProfile, updateExpoPushToken } from "./functions";
// import FormData from "form-data";

export const useInitialUpdateProfile = () => {
    return useMutation({
        mutationFn: async ({ formData, token }:{formData: FormData, token: string}) => await initialUpdateProfile(formData, token)
    })
}

export const useUpdateExpoPushToken = () => {
    return useMutation({
        mutationFn: async ({ formData, token }: { formData: { expo_push_token: string }, token: string }) => await updateExpoPushToken(formData, token)
    })
}