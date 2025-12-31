import { pool } from "../../config/db";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import config from "../../config";


const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const hashedPass = await bcrypt.hash(password as string, 10)
    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`, [name, email, hashedPass, phone, role]
    )
    return result;
}

const loginUser = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
    if (result.rows.length === 0) return null;

    const {id, name, email:dbEmail, password:hashedPass, phone, role} = result.rows[0]

    const match = await bcrypt.compare(password, hashedPass)

    if (!match) {
        return false
    }
    const token = jwt.sign({ name, dbEmail, role }, config.jwtSecret as string, {
        expiresIn: "7d"
    })
    const plusPhone= '+'+phone
    const user={
        id,
        name,
        email:dbEmail,
        phone:plusPhone,
        role
    }
    return { token, user }
}

export const authServices = {
    createUser,
    loginUser
}
