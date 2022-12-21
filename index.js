const ProductManager = require('./ProductManager')
const manager = new ProductManager('./products.json')
const express = require("express");

const app = express();

app.get("/products", async (req, res) => {
    const products = await manager.getProducts()
    const limit = req.query.limit;
    if (limit) {
        return res.send(products.slice(0,+limit));
    } else {
        res.send(products);
    }
});

app.get("/products/:pId", async (req, res) => {
    console.log(req.params);
    const products = await manager.getProducts()
    const pId = req.params.pId;
    const product = products.find (products => products.id === +pId);
    if (!product) {
        return res.status(404).send("No existe un producto con ese ID");
    }
    res.send(product);
});

app.listen(8080, () => {
    console.log("servidor ejecutandose en puerto 8080");
})

