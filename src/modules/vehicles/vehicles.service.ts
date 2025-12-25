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

const getSpecificVehicle= async(id:string)=>{
    console.log(id);
    const result =await pool.query(`SELECT * FROM vehicles WHERE id=$1`,[id])
    return result;
}

export const vehiclesServices = {
    addNewVehicle,
    getVehicle,
    getSpecificVehicle
}