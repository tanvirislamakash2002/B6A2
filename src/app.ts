import express, { Request, Response } from 'express'
import { authRoutes } from './modules/auth/auth.route'
import initDB from './config/db'
import { userRoutes } from './modules/users/users.route'
import { vehicleRoutes } from './modules/vehicles/vehicles.route'
import { bookingsRoutes } from './modules/bookings/bookings.route'
const app = express()

app.use(express.json())

initDB()

app.get('/', (req: Request, res: Response) => {
    res.send('server is running')
})

app.use('/api/v1/auth', authRoutes)

// user routes
app.use('/api/v1/users', userRoutes)

// vehicles routes
app.use('/api/v1/vehicles', vehicleRoutes)

// bookings routes
app.use('/api/v1/bookings', bookingsRoutes)

// not found route
app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found",
        path:req.path
    })
})

export default app;