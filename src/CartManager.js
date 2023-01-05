const fs = require('fs/promises');
const { existsSync } = require('fs');
const ProductManager = require("./ProductManager");
const manager = new ProductManager("./products.json");


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
    
    async addCart() {
        const carts = await this.getCarts();
        if (!carts.length) {
            CartManager.countId+1;
        } else {
            CartManager.countId = carts[carts.length - 1].OrderId +1;
        }
        const cartNew = {
            OrderId: CartManager.countId,
            products: [],   
        }
        carts.push(cartNew);
        await this.writeFile(carts);
        return cartNew;
    }


    async getCartById(cId) {
        const carts = await this.getCarts()
        const cartFound = carts.find(cart => cart.OrderId === cId)
        if (!cartFound) {
            console.error("Cart not found");
            return;
        } else {
            console.log(cartFound);
        }
    }
    
    async addProductToCart(cId, pId) {
        let cart = await manager.getProducts();
        const order = cart.find((o) => o.OrderId === cId);
        if (order) {
          const productExist = order.products.find((product) => product.prodId == pId);
    
          if (productExist) {
            const orderPosition = cart.findIndex((order) => order.orderId === cId);
            const updateProduct = cart[orderPosition].products.find(
              (product) => product.prodId === pId
            );
            const productPosition = cart[orderPosition].products.findIndex(
              (product) => product.prodId === pId
            );
    
            cart[orderPosition].products[productPosition].quantity =
              updateProduct.quantity+1;
            await this.writeFile(cart);
            return cart;
          } else {
            const newProduct = { ProdId: pId, quantity: 1 };
            const orderPosition = cart.findIndex((order) => order.OrderId === cId);
            if (orderPosition >= 0) {
              cart[orderPosition].products.push(newProduct);
              await this.writeFile(cart);
              return cart;
            }
          }
        } else {
          const cartNew = {
            OrderId: CartManager.countId,
            products: [{ ProdId: pId, quantity: 1 }],
          };
          cart.push(cartNew);
          await this.writeFile(cart);
          return cart;
        }
      }
    }

module.exports = CartManager;