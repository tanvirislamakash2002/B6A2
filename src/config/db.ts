import config from ".";
import {Pool} from 'pg'
export const pool = new Pool({
    connectionString : `${config.connection_str}`
})

const initDB = async()=>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS table_name(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
        )
        `)
}

export default initDB;