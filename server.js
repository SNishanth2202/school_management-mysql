import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
import schoolRoutes from './routes/school.js';  

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', schoolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});