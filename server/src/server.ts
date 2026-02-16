import express from 'express';
import cors from 'cors';
import routes from '../src/routes';
import 'dotenv/config';

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`Server running on ${port}`));


const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
