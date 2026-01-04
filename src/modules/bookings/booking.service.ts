import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const addForBookings = async (payload: Record<string, unknown>, total_price: number) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const result = await pool.query(
        `WITH update_vehicles AS (UPDATE vehicles SET availability_status=$7 WHERE id=$2 RETURNING vehicle_name, daily_rent_price)
        INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *,
        (SELECT json_build_object('vehicle_name',vehicle_name,'daily_rent_price',daily_rent_price) FROM update_vehicles LIMIT 1) AS vehicle
        `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active', 'booked']
    )
    return result;
}

const checkIsAvailable = async (id: string) => {
    return await pool.query(
        `SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1 AND availability_status = 'available' FOR UPDATE`, [id]
    )
}

const getAllBookings = async () => {
    const result = await pool.query(`SELECT bookings.* ,
            (SELECT json_build_object('name',name,'email',email) FROM users 
            WHERE users.id=bookings.customer_id) AS customer ,
            (SELECT json_build_object('vehicle_name',vehicle_name,'registration_number',registration_number) FROM vehicles 
            WHERE vehicles.id=bookings.vehicle_id) AS vehicle 
            FROM bookings 
            `)
    return result
}

const getOwnBookings = async (user: JwtPayload) => {
    const result = await pool.query(`SELECT bookings.id, vehicle_id, rent_start_date, rent_end_date, total_price, status ,
            (SELECT json_build_object(
            'vehicle_name',vehicle_name,
            'registration_number',registration_number,
            'type',type
            ) FROM vehicles LIMIT 1) AS vehicle FROM bookings WHERE customer_id=(SELECT id FROM users WHERE email=$1)`, [user.email])
    return result
}

const statusUpdateByAdmin = async (id: string, status: string) => {
    
    const result = await pool.query(
        `WITH update_vehicle AS (
        UPDATE vehicles SET availability_status=$3 
        WHERE id= (SELECT vehicle_id FROM bookings WHERE id = $2) 
        RETURNING availability_status
        )
        UPDATE bookings SET status=$1 
        WHERE id=$2 RETURNING *, 
        (SELECT json_build_object('availability_status',availability_status) FROM update_vehicle LIMIT 1) AS vehicle`, [status, id, 'available']
    )
    return result

}
const statusUpdateByCustomer = async (id: string, status: string) => {

        const result = await pool.query(
        `WITH updated_booking AS (
        UPDATE vehicles SET availability_status=$3 
        WHERE id = (SELECT vehicle_id FROM bookings WHERE id = $2) )
        UPDATE bookings SET status=$1 
            WHERE id=$2 RETURNING *`, [status, id, 'available']
        )

        return result
    
}

const getRentStartDate = async (id:string) => {
    return await pool.query(
        `SELECT rent_start_date FROM bookings WHERE id=$1`, [id]
    )
}

export const bookingsServices = {
    checkIsAvailable,
    addForBookings,
    getAllBookings,
    getOwnBookings,
    statusUpdateByAdmin,
    getRentStartDate,
    statusUpdateByCustomer
}