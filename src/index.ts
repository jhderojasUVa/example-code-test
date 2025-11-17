import express from 'express';
import { authMiddleware } from './middleware/auth';
import evidenceRoutes from './routes/evidence';
import reportsRoutes from './routes/reports';

// This is the main entry point of the application.

// Create a new Express application.
const app = express();
// Set the port to the environment variable PORT or 3000.
const port = process.env.PORT || 3000;

// Use the express.json middleware to parse JSON bodies.
app.use(express.json());

// Use the authentication middleware for all routes.
app.use(authMiddleware);

// Use the evidence routes for all routes starting with /evidence.
app.use('/evidence', evidenceRoutes);
// Use the reports routes for all routes starting with /reports.
app.use('/reports', reportsRoutes);

// Start the server and listen on the specified port.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the app for testing purposes.
export default app;
