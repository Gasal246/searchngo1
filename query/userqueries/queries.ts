import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialUpdateProfile } from "./functions";
// import FormData from "form-data";

export const useInitialUpdateProfile = () => {
    return useMutation({
        mutationFn: async ({ formData, token }:{formData: FormData, token: string}) => await  initialUpdateProfile(formData, token)
    })
}

