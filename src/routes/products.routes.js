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
    const product = products.find (products => products.id === +pId);
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

// NO FUNCIONA 
/*router.put ("/:pId", async (req, res) => {
        const products= await manager.getProducts()
        const newProperties = req.body;
        const productFound = products.find(product => product.id === req.params.pId)
        const productUpdated = {...productFound, ...newProperties}
        products.map(product => product.id === productUpdated.id)
                res.json({
                    status: "success",
                    data: productUpdated
                }) 
        })
        */
//no anda y me cambia el json
router.put ("/:pId", async (req, res) => { 
    await manager.updateProduct(req.params.pId);
    const newProperties = req.body;
    res.json({
        status: "success",
        data: newProperties
    })
})

//NO FUNCIONA
/*
router.put ("/:pId", async (req, res) => {
const products = await manager.getProducts()
    const newProperties = req.body;
        const productIndex = products.findIndex(product => products.id === req.params.pId);
        if (productIndex < 0) {
            return res.status(404).json({
                status: "error",
                data: "Product Not Found"
            })
        } else {
            products[productIndex] = newProperties;
            res.json ({
                status: "success",
                data: "Product updated successfully"
            }) 
        }
    })*/

    router.delete("/:pId", async (req, res) => {
        await manager.deleteProduct(req.params.pId);
        res.json({
            status: "success",
            data: "Product has been removed"
        })
    })



module.exports = router;

