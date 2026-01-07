import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const getUser = async () => {
    const result = await pool.query(
        `SELECT id, name, email, phone, role FROM users`
    )
    return result;
}

const updateUser = async (id: string, payload: Record<string, unknown>) => {

    const { ...updates } = payload

    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields.map((field, i) => `${field}=$${i + 1}`).join(', ')

    const result = await pool.query(
        `UPDATE users SET ${setClause} WHERE id=$${fields.length + 1} RETURNING id, name, email, phone, role`, [...values, id])

    return result

}

const checkUser = async (id: string) => {
    return await pool.query(`SELECT * FROM users WHERE id=$1`, [id])
}


const deleteUser = async (id: string) => {

    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id])
    return result;

}
const checkActiveBookings = async (id: string) => {
    return await pool.query(`SELECT * FROM bookings WHERE customer_id=$1 AND status=$2`, [id, 'active'])
}

export const userServices = {
    getUser,
    checkUser,
    updateUser,
    checkActiveBookings,
    deleteUser
}
