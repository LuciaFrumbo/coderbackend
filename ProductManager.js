const fs = require('fs/promises');
const { existsSync } = require('fs');


class ProductManager {
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


    async getProducts() {
        
        if (existsSync(this.path)) {
            return await this.readFile();
        } else {
            return [];
        }
    }
    
    async addProduct(product) {
        const products = await this.getProducts()
        if (!products.length) {
            ProductManager.countId+1;
        } else {
            ProductManager.countId = products[products.length - 1].id +1;
        }
        const productNew = {
            id: ProductManager.countId,
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
                !productNew.thumbnail ||
                !productNew.code 
            ) {
                console.log("Todos los campos son obligatorios!")
            } else {
                products.push(productNew);
                await this.writeFile(products);
                return productNew;
            }
        }
    }

    async getProductById(idProduct) {
        const products = await this.getProducts()
        const productFound = products.find(product => product.id === idProduct)
        if (!productFound) {
            console.error("Producto no encontrado");
            return;
        } else {
            console.log(productFound);
        }
    }

    async updateProduct(idProduct, newProperties){
        const products = await this.getProducts()
        const productFound = products.find(product => product.id === idProduct)
        const productUpdated = {...productFound, ...newProperties}
        const updatedList = products.map(product =>{
            if (product.id === productUpdated.id){
                return productUpdated
            } else {
                return product
            }
        })
        const stringList = await JSON.stringify(updatedList,null, "\t")

        await this.writeFile(stringList)
        return stringList
    }

    async deleteProduct(idProduct){
        const products = await this.getProducts()
        const productFound = products.find(product => product.id === idProduct)
       if(!productFound){
        console.log("no existe producto con ese ID")
       } else {
       products.splice(idProduct);
       console.log("producto borrado");
    }
        await this.writeFile(products);
        return products;

    }
    
}

module.exports = ProductManager;