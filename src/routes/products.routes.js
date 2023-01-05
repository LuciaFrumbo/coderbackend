const { Router } = require("express");
const ProductManager = require("../ProductManager");
const router = Router ();
const manager = new ProductManager('./src/products.json');

router.get("/", async (req, res) => {
    const products = await manager.getProducts()
    const limit = req.query.limit;
    if (limit) {
        return res.send({
            status: "success",
            data: products.slice(0,+limit)});
    } else {
        res.send({ 
            status: "success", 
            data: products});
    }
});


router.get("/:pId", async (req, res) => {
    console.log(req.params);
    const products = await manager.getProducts()
    const pId = req.params.pId;
    const product = products.find(products => products.id === +pId);
    if (!product) {
        return res.status(404).send("No existe un producto con ese ID");
    }
    res.send({ 
        status: "success", 
        data: product});
});

router.post("/", async (req, res) => {
    const products = await manager.getProducts()
    const product = req.body
    if (!products.length) {
        ProductManager.countId+1;
    } else {
        ProductManager.countId = products[products.length - 1].id +1;
    }
    const productNew = {
        id: ProductManager.countId,
        status: true,
        ...product,
    }

    if (products.find(product => product.code == productNew.code)) {
        console.log("Ese código ya existe, debe ingresar uno diferente")
    } else {
        if (
            !productNew.title ||
            !productNew.description ||
            !productNew.price ||
            !productNew.stock ||
            !productNew.code
        ) {
            res.status(400).json({
                status: "error",
                error: "Incompletes Values"
            })
        } else {
            products.push(productNew);
            await manager.writeFile(products);
            res.json({
            status: "success",
            data: productNew
        });
        }
    }
});

router.put ("/:pId", async (req, res) => { 
    const newP = req.body;
    const pId = +req.params.pId
    const data = await manager.updateProduct(pId, newP);
    console.log(data);
    if(data) {
        res.json({
        status: "success",
        data: "Product updated successfully"
    })
} else {
    res.status(400).send("Product not found")
}
})

    router.delete("/:pId", async (req, res) => {
        await manager.deleteProduct(req.params.pId);
        res.json({
            status: "success",
            data: "Product has been removed"
        })
    })



module.exports = router;

