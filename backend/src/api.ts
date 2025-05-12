import dotenv from 'dotenv';
import router from './routes';
import express from 'express';
import cors from 'cors';


dotenv.config();
const app = express();
const PORT = 3500;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})
