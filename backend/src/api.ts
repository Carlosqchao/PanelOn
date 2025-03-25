import express from 'express';
import subscriptionRouter from './routes/subscription-management'

const app = express();

app.use(express.json());
app.use('/subscriptions', subscriptionRouter);
