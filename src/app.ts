import express, { Request, Response } from 'express'
import { authRoutes } from './modules/auth/auth.route'
import initDB from './config/db'
import { userRoutes } from './modules/users/users.route'
const app = express()

app.use(express.json())

initDB()

app.get('/', (req: Request, res: Response) => {
    res.send('server is running')
})

app.use('/new', authRoutes)

// user routes
app.use('/new', userRoutes)

export default app;