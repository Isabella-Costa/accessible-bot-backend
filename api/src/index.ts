import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

import prisma from './prisma';

import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import authRouter from './routes/authRoutes'; 
import faqRoutes from './routes/faqRoutes';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swaggerConfig'; 

import { ChatController } from './controllers/chatController';

dotenv.config();

const app = express();

prisma.$connect()
  .then(() => console.log('Conectado ao PostgreSQL via Prisma!'))
  .catch(err => console.error('Erro na conexão Prisma → PostgreSQL:', err));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', chatRoutes);
app.use('/api', authRouter);
app.use('/api', faqRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static('src/websocket'));

const server = http.createServer(app);
new ChatController(server);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log("O servidor está sendo encerrado. As conversas estão sendo terminadas.");
  await prisma.historic.updateMany({
    where: { terminated: false },
    data: {
      terminated: true,
      endedAt: new Date(),
    },
  });
  process.exit(0);
});
