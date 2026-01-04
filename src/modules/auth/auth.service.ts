import { pool } from "../../config/db";
import bcrypt from "bcryptjs"

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const hashedPass = await bcrypt.hash(password as string, 10)
    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`, [name, email, hashedPass, phone, role]
    )
    return result;
}

const loginUser = async (email: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
    return result
}

export const authServices = {
    createUser,
    loginUser
}
