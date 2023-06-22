import express from 'express'
import cors from "cors"

import AppError from './utils/AppError.js'
import eventRoutes  from './routes/event.js'
import database from './database.js'

const app = express();
app.use(express.json({limit:'30mb',extended:true}))
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use(cors());

app.get('/' , (req,res)=>{
    res.send('This is an API')
})

// database.main()
//     .then(console.log)
//     .catch(console.error)

app.use( eventRoutes )

app.all("*" , (req,res,next)=>{
    next(new AppError("Page not found" , 400))
})
app.use((err ,req,res,next)=>{
    // const { status = 500 } = err
    if (!err.message) { err.message = "Something went wrong!!!"}
    if (!err.status) { err.status = 500}
    res.send(500 , err.message)
})

app.listen(3000, ()=>{
    console.log("App is listening on port 3000")
} )