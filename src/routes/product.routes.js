//это маршруты запросов

import express from 'express';
import {addProduct, deleteProduct, getAllProduct, updateProductById} from '../controllers/product.controller.js'

const router = express.Router();

router.post('/products', addProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id', updateProductById);
router.get('/products', getAllProduct);

export default router;