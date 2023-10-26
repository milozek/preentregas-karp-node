import express from "express"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

const app = express()
const PORT = 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
    if (req.ip == "127.0.0.1") {
        res.status(403).send("Not allowed")
    } else {
        next()
    }
})
app.use((err, req, res, next) => {
    console.error(err)
    res.send("error!")
})
app.use("/files", express.static("db"))
app.use("/assets", express.static("public"))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})
