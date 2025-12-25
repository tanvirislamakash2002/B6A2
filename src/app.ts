import express, { Request, Response } from 'express'
import { authRoutes } from './modules/auth/auth.route'
import initDB from './config/db'
import { userRoutes } from './modules/users/users.route'
import { vehicleRoutes } from './modules/vehicles/vehicles.route'
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

export default app;