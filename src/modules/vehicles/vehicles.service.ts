import { pool } from "../../config/db";

const addNewVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await pool.query(
        `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    )
    return result;
}

const getVehicle = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`)
    return result;
}

const getSpecificVehicle = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id])
    return result;
}

const updateSpecificVehicle = async (payload: Record<string, unknown>) => {
    const { id, ...updates } = payload;

    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields.map((field, i) => `${field}=$${i + 1}`).join(', ')

    const result = await pool.query(
        `UPDATE vehicles SET ${setClause} WHERE id=$${fields.length + 1} RETURNING *`,
        [...values, id]
    )
    return result;
}

const deleteVehicle = async (id: string) => {
    const result = await pool.query(
        `DELETE FROM vehicles WHERE id=$1 AND availability_status=$2`, [id, 'available']
    )
    return result;
}

export const vehiclesServices = {
    addNewVehicle,
    getVehicle,
    getSpecificVehicle,
    updateSpecificVehicle,
    deleteVehicle
}