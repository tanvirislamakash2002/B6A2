import config from ".";
import { Pool } from 'pg'
export const pool = new Pool({
    connectionString: `${config.connection_str}`
})

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL CHECK(LENGTH(password)>=6),
        phone VARCHAR NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer'))
        )
        `)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike','van','SUV')),
        registration_number VARCHAR(150) UNIQUE NOT NULL,
        daily_rent_price INTEGER NOT NULL CHECK (daily_rent_price>0),
        availability_status VARCHAR(50) NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )
        `)
}

export default initDB;