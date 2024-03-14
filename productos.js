const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;

        // leer productos desde el archivo
        this.readProductsFromFile();
    }

    readProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            // calcular el ID
            const maxId = Math.max(...this.products.map(product => product.id), 0);
            this.productIdCounter = maxId + 1;
        } catch (err) {
            console.error("Error al leer el archivo de productos:", err.message);
        }
    }

    saveProductsToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
            console.log("Productos guardados en el archivo:", this.path);
        } catch (err) {
            console.error("Error al guardar los productos en el archivo:", err.message);
        }
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (this.products.some(p => p.code === product.code)) {
            throw new Error("Ya existe un producto con el mismo código");
        }

        product.id = this.productIdCounter++;
        this.products.push(product);
        this.saveProductsToFile();
        console.log("Producto agregado:", product);
    }

    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }


    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            return product;
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            // mantener el ID del producto y actualizar los campos 
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProductsToFile();
            console.log(`Producto con ID ${id} actualizado.`);
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProductsToFile();
            console.log(`Producto con ID ${id} eliminado.`);
        } else {
            throw new Error("Producto no encontrado");
        }
    }
}
module.exports = ProductManager;
// ej de uso
const productManager = new ProductManager('productos.json');

try {
    productManager.addProduct({
        title: "Producto 1",
        description: "Descripción del Producto 1",
        price: 10.99,
        thumbnail: "img/img1.jpg",
        code: "ABC123",
        stock: 100
    });

    productManager.addProduct({
        title: "Producto 2",
        description: "Descripción del Producto 2",
        price: 20.99,
        thumbnail: "img/img2.jpg",
        code: "DEF456",
        stock: 50
    });

    productManager.addProduct({
        title: "Producto 3",
        description: "Descripción del Producto 3",
        price: 30.99,
        thumbnail: "img/img3.jpg",
        code: "GHI789",
        stock: 75
    });

    console.log("Todos los productos:", productManager.getProducts());

    console.log("Producto con ID 1:", productManager.getProductById(1));
    console.log("Producto con ID 3:", productManager.getProductById(3));

    productManager.updateProduct(2, { price: 25.99, stock: 60 });
    console.log("Producto actualizado:", productManager.getProductById(2));

    productManager.deleteProduct(1);
    console.log("Productos después de eliminar:", productManager.getProducts());
} catch (error) {
    console.error(error.message);
}