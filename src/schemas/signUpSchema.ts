import {z} from "zod"

export const userValidation = z
        .string()
        .min(2, "atleast type 2 characters bro...")
        .max(12, "Nah, not more that 12 characters bro...")
        .regex(/^[a-zA-Z0-9_]+$/ , "username can't contain special characters")

        export const signUpSchema = z.object({
            username: userValidation,
            email: z.email({message: "not a valid email address..."}),
            password: z.string().min(5, "password must be 5 characters long").max(12, "password must be less than 12 characters")
        })