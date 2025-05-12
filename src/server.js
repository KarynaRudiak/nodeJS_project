import express from 'express';
import connectDB from './config/db.js';
import productRoutes from './routes/product.routes.js'


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Hello home page' });
});

app.use('/api', productRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server', error);
    });