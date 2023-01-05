const { Router } = require("express");
const CartManager = require("../CartManager");
const router = Router ();
const manager = new CartManager("./src/carts.json")


router.post("/", async (req, res) => {
    await manager.addCart(req.body)
    res.json({
        status: "success",
        data: "new cart created"
    })
})

router.get("/:cId", async (req, res) => {
    const carts = await manager.getCarts()
    const cId = req.params.cId;
    const cart = carts.find (carts => carts.OrderId === +cId);
    if (!cart) {
        return res.status(404).send("No existe un carrito con ese ID");
    }
    res.send({ 
        status: cId, 
        data: cart.products});
});

router.post("/:cId/product/:pId", async (req,res) => {
    const cId = req.params.cId;
    const pId = req.params.pId;
    await manager.addProductToCart(cId, pId)
    if (!cId || !pId) {
        res.status(404).send("verifique el Id del carrito o el producto");
    }else {
    res.send ({
        status: "success",
        data: "product updated"
    })
    }
})



module.exports = router;