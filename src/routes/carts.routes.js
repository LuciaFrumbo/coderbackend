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

router.get("/:pId", async (req, res) => {
    console.log(req.params);
    const carts = await manager.getCarts()
    const pId = req.params.pId;
    const cart = carts.find (carts => carts.id === +pId);
    if (!cart) {
        return res.status(404).send("No existe un carricto con ese ID");
    }
    res.send({ 
        status: "success", 
        data: cart.products});
});


//ruta POST que agregue el producto al carrito  seleccionado, y si el producto ya esta, solo sumar la cantidad


module.exports = router;