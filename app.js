const express = require('express');
const fs = require('fs');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas para productos
const productRouter = express.Router();
const productsManager = new ProductManager('productos.json');

productRouter.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = productsManager.getProducts(limit);
    res.json(products);
});

productRouter.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = productsManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productRouter.post('/', (req, res) => {
    try {
        const newProduct = req.body;
        productsManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productRouter.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        productsManager.updateProduct(productId, req.body);
        res.json({ message: `Producto con ID ${productId} actualizado correctamente` });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productRouter.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        productsManager.deleteProduct(productId);
        res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.use('/api/products', productRouter);

// Rutas para carritos
const cartRouter = express.Router();
const CARTS_FILE_PATH = 'carrito.json';

cartRouter.post('/', (req, res) => {
    try {
        const newCartId = generateUniqueId(); // Generar un nuevo ID de carrito único
        const newCart = {
            id: newCartId,
            products: []
        };
        fs.writeFileSync(CARTS_FILE_PATH, JSON.stringify(newCart));
        res.status(201).json({ message: 'Carrito creado correctamente', cartId: newCartId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

cartRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartData = fs.readFileSync(CARTS_FILE_PATH, 'utf8');
        const cart = JSON.parse(cartData);
        if (cart.id !== cartId) {
            throw new Error('Carrito no encontrado');
        }
        res.json(cart.products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const cartData = fs.readFileSync(CARTS_FILE_PATH, 'utf8');
        const cart = JSON.parse(cartData);
        const existingProductIndex = cart.products.findIndex(item => item.product === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        fs.writeFileSync(CARTS_FILE_PATH, JSON.stringify(cart));
        res.json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.use('/api/carts', cartRouter);

// Función ID único
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
