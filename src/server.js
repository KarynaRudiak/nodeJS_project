import express from 'express';
import connectDB from './config/db.js';
import productRoutes from './routes/product.routes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./openapi.yaml'); 

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Hello home page' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', productRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server', error);
    });
