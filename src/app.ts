import express, { Request, Response } from 'express'
import { authRoutes } from './modules/auth.route'
import initDB from './config/db'
const app = express()

app.use(express.json())

initDB()

app.get('/', (req: Request, res: Response) => {
    res.send('server is running')
})

app.use('/new', authRoutes)
export default app;