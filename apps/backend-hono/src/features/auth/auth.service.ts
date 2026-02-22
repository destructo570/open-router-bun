import { drizzle } from "drizzle-orm/node-postgres";
import { LoginDTO, RegisterDTO } from "./auth.schema"
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../../errors/app-error";
import * as argon2 from "argon2";
const db = drizzle(process.env.DATABASE_URL!);
import { sign, verify } from "hono/jwt";
import { Errors } from "../../errors/error-messages";

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (payload: RegisterDTO) => {
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, payload.email)).limit(1);

    if (existingUser.length > 0) {
        throw new AppError("Email already exists", 400);
    }

    const hashed_password = await argon2.hash(payload.password);

    console.log("hashed_password", hashed_password);

    const user = await db.insert(usersTable).values({
        ...payload,
        password: hashed_password
    }).returning({
        id: usersTable.id,
        first_name: usersTable.first_name,
        last_name: usersTable.last_name,
        email: usersTable.email
    });

    return user;
}

export const loginUser = async(payload: LoginDTO) => {
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, payload.email)).limit(1);

    if(existingUser.length === 0){
        throw new AppError("User does not exist", 404);
    }
    const user = existingUser[0];
    const hashed_pass = user.password!;

    const is_valid = await argon2.verify(hashed_pass, payload.password);
    console.log("JWT_SECRET", JWT_SECRET);
    
    if(is_valid){
        const token = await sign({
            user_id: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        }, JWT_SECRET);

        return {token}
    }else{
        throw Errors.InvalidCredentials();
    }
    
}