import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const addForBookings = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const checkIsAvailable = await pool.query(
        `SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1 AND availability_status = 'available' FOR UPDATE`, [vehicle_id]
    )
    if (checkIsAvailable.rowCount === 0) {
        return 'there is no vehicle available'
    }

    const { vehicle_name, daily_rent_price } = checkIsAvailable.rows[0]

    const startDate = new Date(rent_start_date as string)
    const endDate = new Date(rent_end_date as string)

    const durationDays = Math.ceil(endDate.getTime() - startDate.getTime()) / (60 * 60 * 24 * 1000)

    const total_price = durationDays * daily_rent_price

    // const updateAvailabilityStatus = await pool.query(
    //     `UPDATE vehicles SET availability_status=$2 WHERE id=$1`, [vehicle_id, 'booked',]
    // )
    const result = await pool.query(
        `WITH update_vehicles AS (UPDATE vehicles SET availability_status=$7 WHERE id=$2 RETURNING vehicle_name, daily_rent_price)
        INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *,
        (SELECT json_build_object('vehicle_name',vehicle_name,'daily_rent_price',daily_rent_price) FROM update_vehicles LIMIT 1) AS vehicle
        `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active', 'booked']
    )
    // result.rows[0].vehicle = { vehicle_name, daily_rent_price }
    return result;
}

const getAllBookings = async (user: JwtPayload) => {
    if (user.role === 'admin') {
        const result = await pool.query(`SELECT * FROM bookings`)
        return result
    } else if (user.role === 'customer') {
        const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=(SELECT id FROM users WHERE email=$1)`, [user.email])
        return result
    }else{
        return null
    }
}

const updateBookingsStatus = async (status: string, id: string) => {

    // const result = await pool.query(
    //     `UPDATE bookings SET status=$1 
    //     WHERE id=$2 RETURNING *`, [status, id]
    // )
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

export const bookingsServices = {
    addForBookings,
    getAllBookings,
    updateBookingsStatus
}