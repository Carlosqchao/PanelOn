import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createSubscription, getUserSubscription, cancelSubscription } from './services/subscription-management';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/subscription/create', (req, res) => createSubscription(req, res));
app.get('/subscription/:userId', (req, res) => getUserSubscription(req, res));
app.post('/subscription/cancel', (req, res) => cancelSubscription(req, res));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
