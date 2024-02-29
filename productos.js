class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        if (this.products.some(p => p.code === product.code)) {
            console.error("Ya existe un producto con el mismo código");
            return;
        }

        product.id = this.productIdCounter++;
        this.products.push(product);
        console.log("Producto agregado:", product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
        }
    }
}

const productManager = new ProductManager();

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