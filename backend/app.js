import express from 'express';
import data_Router from './routes/data/Data_Router';
import workspace_Router from './routes/data/workspace';
const app = express();
app.use(express.json());
app.use('/api/v1/data', data_Router);
app.use("/api/v1/workspace" , workspace_Router)

export default app;