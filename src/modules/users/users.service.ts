import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
const getUser = async () => {
    const result = await pool.query(
        `SELECT id, name, email, phone, role FROM users`
    )
    return result;
}

const getSingleUser = async (id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    return result;
}

const updateUser = async (id: string, payload: Record<string, unknown>, user: JwtPayload) => {

    const { name, email, phone, role: insertedRole } = payload

    const checkUser = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

    if (checkUser.rows.length === 0) {
        return checkUser

    } else {
        if (user.role === 'admin' || checkUser.rows[0].email === user.dbEmail) {
            const result = await pool.query(
                `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING name, email, phone, role`, [name, email, phone, insertedRole, id])
            return result

        } else {
            return false
        }
    }

}

const deleteUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id])
    return result;
}

export const userServices = {
    getUser,
    getSingleUser,
    updateUser,
    deleteUser
}
