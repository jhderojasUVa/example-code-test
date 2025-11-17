import express from 'express';
import { authMiddleware } from './middleware/auth';
import evidenceRoutes from './routes/evidence';
import reportsRoutes from './routes/reports';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(authMiddleware);

app.use('/evidence', evidenceRoutes);
app.use('/reports', reportsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
