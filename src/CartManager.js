const fs = require('fs/promises');
const { existsSync } = require('fs');
const ProductManager = require("./ProductManager");
//const manager = new ProductManager = require("./products.json");


class CartManager {
    static countId = 0;

    constructor(path) {
        this.path = path;
    }
    async readFile() {
        const text = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(text);
        return data;
      }

    async writeFile(data){
      const dataStr = JSON.stringify(data, null, '\t');
      await fs.writeFile(this.path, dataStr); 
      }
    
     async getCarts() {
        if (existsSync(this.path)) {
            return await this.readFile();
        } else {
            return [];
        }

      }
    
    async addCart(cart) {
        const carts = await this.getCarts();
        if (!carts.length) {
            CartManager.countId+1;
        } else {
            CartManager.countId = carts[carts.length - 1].id +1;
        }
        const cartNew = {
            id: CartManager.countId,
            products: []
        }
        carts.push(cartNew);
        await this.writeFile(carts);
        return cartNew;
    }


    async getCartsbyId(idCart) {
        const carts = await this.getCarts()
        const cartFound = carts.find(cart => cart.id === idCart)
        if (!cartFound) {
            console.error("carrito no encontrado");
            return;
        } else {
            console.log(cartFound);
        }
    }
    // falta terminar
    async addProductToCart(cId, pId, quantity) {
        await manager.getProductById(+(pId))
        const savedCarts = await this.getCarts()
        const idSavedCart = await this.getCartById(cId)
        await idSavedCart.products.find(product => product.product == pId)
    }

    async deleteCart(idCart) {
        const carts = await this.getCarts()
        const cartFound = carts.find(cart => cart.id === idCart)
       if(!cartFound){
        console.log("no existe carrito con ese ID")
       } else {
       carts.splice(idCart);
       console.log("carrito borrado");
    }
        await this.writeFile(carts);
        return carts;
    }
}

module.exports = CartManager;