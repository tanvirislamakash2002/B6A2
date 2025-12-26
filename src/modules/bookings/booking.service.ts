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

    const updateAvailabilityStatus = await pool.query(
        `UPDATE vehicles SET availability_status=$2 WHERE id=$1`, [vehicle_id, 'booked',]
    )
    const result = await pool.query(
        `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active']
    )
    result.rows[0].vehicle = { vehicle_name, daily_rent_price }
    return result;
}

export const bookingsServices = {
    addForBookings
}