const express = require("express");
const cartsRoutes = require("./routes/carts.routes");
const productsRoutes = require("./routes/products.routes");

const app = express();

app.use(express.json())
app.use('/api/products/', productsRoutes)
app.use('/api/carts/', cartsRoutes)
app.listen(8080, () => {
    console.log("Listening on port 8080");
})
