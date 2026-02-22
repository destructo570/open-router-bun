import { password } from "bun";
import z from "zod";


export const registerUserSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.email(),
    password: z.string().min(8)
});


export const loginSchema = z.object({
    email: z.email(),
    password: z.string()
});

export type RegisterDTO = z.infer<typeof registerUserSchema>
export type LoginDTO = z.infer<typeof loginSchema>