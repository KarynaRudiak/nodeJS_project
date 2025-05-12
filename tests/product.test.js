import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import productRoutes from '../src/routes/product.routes.js';
import Product from '../src/models/Product.js';

jest.mock('../src/models/Product.js', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api', productRoutes);

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('POST /api/products', () => {
    it('should create a product and return 201', async () => {
      const mockProduct = { name: 'Test', quantity: 5, price: 100 };
      Product.create.mockResolvedValue(mockProduct);

      const res = await request(app)
        .post('/api/products')
        .send(mockProduct);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Product is added');
      expect(Product.create).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 400 if name or price missing', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ quantity: 5 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('All fields are required');
    });

    it('should return 500 if create throws an error', async () => {
      Product.create.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test', quantity: 5, price: 100 });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database error');
    });
  });


  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const mockProducts = [{ name: 'A', price: 1 }, { name: 'B', price: 2 }];
      Product.find.mockResolvedValue(mockProducts);

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducts);
    });

    it('should return 404 if no products', async () => {
      Product.find.mockResolvedValue(null);

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(404);
    });

    it('should return 500 if find throws an error', async () => {
      Product.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database error');
    });
  });


  describe('DELETE /api/products/:id', () => {
    it('should delete a product and return success message', async () => {
      Product.findByIdAndDelete.mockResolvedValue({ _id: '1' });

      const res = await request(app).delete('/api/products/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product was deleted');
    });

    it('should return 404 if product not found', async () => {
      Product.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete('/api/products/1');

      expect(res.status).toBe(404);
    });

    it('should return 500 if delete throws an error', async () => {
      Product.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/api/products/1');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database error');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product and return success message', async () => {
      Product.findByIdAndUpdate.mockResolvedValue({ _id: '1' });

      const res = await request(app)
        .put('/api/products/1')
        .send({ name: 'Updated', quantity: 2, price: 50 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product was updated');
    });

    it('should return 404 if product not found for update', async () => {
      Product.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/products/1')
        .send({ name: 'Updated', quantity: 2, price: 50 });

      expect(res.status).toBe(404);
    });

    it('should return 500 if update throws an error', async () => {
      Product.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/api/products/1')
        .send({ name: 'Updated', quantity: 2, price: 50 });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database error');
    });
  });
});
