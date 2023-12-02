import express from "express"
import handlebars from "express-handlebars"
import path from "path"

import { __dirname } from "./utils.js"

import cartsRouter from "./routers/api/products.router.js"
import productsRouter from "./routers/api/products.router.js"
import indexRouter from "./routers/views/index.router.js"

const app = express()

/** Express */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(`${__dirname}`, "../public")))

/** Handlebars */
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

/** Middlewares */
app.use("/", indexRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.use((error, req, res, next) => {
    const message = `Unknown error ${error.message}`
    console.error(message)
    res.status(500).json({ message })
})

export default app
