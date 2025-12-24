import { pool } from "../config/db";
import bcrypt from "bcryptjs"
const createUser = async (payload: Record<string, unknown>) => {
    const { name } = payload;
    // const hashedPass = await bcrypt.hash(password as string, 10)
    const result = await pool.query(
        `INSERT INTO table_name(name) VALUES($1) RETURNING *`, [name]
    )
    return result;
}

export const userServices = {
    createUser
}
