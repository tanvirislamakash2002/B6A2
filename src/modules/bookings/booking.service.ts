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

const getAllBookings = async (user: JwtPayload) => {
    console.log(user);
    if (user.role === 'admin') {
        const result = await pool.query(`SELECT bookings.* ,
            (SELECT json_build_object('vehicle_name',vehicle_name,'registration_number',registration_number) FROM vehicles LIMIT 1) AS vehicle FROM bookings`)
        console.log(0);
        return result
    } else if (user.role === 'customer') {
        const result = await pool.query(`SELECT bookings.* ,
            (SELECT json_build_object(
            'vehicle_name',vehicle_name,
            'registration_number',registration_number,
            'type',type
            ) FROM vehicles LIMIT 1) AS vehicle FROM bookings WHERE customer_id=(SELECT id FROM users WHERE email=$1)`, [user.dbEmail])
        return result
    } else {
        return false
    }
}

const updateBookingsStatus = async (id: string, status: string, user: JwtPayload) => {

    if (user.role === 'admin' && status === 'returned') {
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
    } else if (user.role === 'customer' && status === 'cancelled') {
        const getRentStartDate = await pool.query(
            `SELECT rent_start_date FROM bookings WHERE id=$1`, [id]
        )
        const currentDate = new Date().getTime() / (60 * 60 * 24 * 1000);
        const rentStartDate = new Date(getRentStartDate.rows[0].rent_start_date).getTime() / (60 * 60 * 24 * 1000);
        console.log(currentDate, rentStartDate);

        if (rentStartDate > currentDate) {
            const result = await pool.query(
                `UPDATE bookings SET status=$1 
            WHERE id=$2 RETURNING *`, [status, id]
            )

            return result
        } else {
            return false
        }
    } else {

        return false
    }
}

export const bookingsServices = {
    checkIsAvailable,
    addForBookings,
    getAllBookings,
    updateBookingsStatus
}