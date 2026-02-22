import { Hono } from "hono"
import { loginSchema, registerUserSchema } from "./auth.schema";
import { AppError } from "../../errors/app-error";
import { loginUser, registerUser } from "./auth.service";
import { Errors, ERRORS } from "../../errors/error-messages";

const auth = new Hono();

auth.post('/register', async (c) => {
    const body = await c.req.json();
    const parsed = registerUserSchema.safeParse(body);

    if (!parsed.success) {
        throw Errors.InvalidRequestBody();
    }

    const user = await registerUser(parsed.data);

    return c.json(user, 200);
});

auth.post('/login', async (c) => {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        throw Errors.InvalidRequestBody();
    }

    const token = await loginUser(parsed.data);

    return c.json(token, 200)
})

export default auth;