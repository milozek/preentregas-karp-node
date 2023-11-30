import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"

import { Server as SocketIO } from "socket.io"
import { Server as HTTPServer } from "http"

import { __dirname } from "./utils.js"

const app = express()

const httpServer = HTTPServer(app)
const io = new SocketIO(httpServer)

const PORT = 8080
const URI = "mongodb+srv://camilokarp:vGIcbwnX6OKTGYi0@cluster0.idtvofh.mongodb.net/"
await mongoose.connect(URI)
console.log("Db connected")

/** Handlebars */
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

/** Express */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

/** Middlewares */
app.use((req, res, next) => {
    if (req.ip == "127.0.0.1") {
        res.status(403).send("Not allowed")
    } else {
        next()
    }
})
app.use((req, res, next) => {
    req.io = io
    next()
})
app.use((error, req, res, next) => {
    const message = `Unknown error ${error.message}`
    console.error(message)
    res.status(500).json({ message })
})

/** Routers */
app.use("/api/products", productsApiRouter)
app.use("/api/carts", cartsApiRouter)
app.use("/", messageApiRouter)
