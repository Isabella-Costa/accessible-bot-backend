import { Request, Response } from 'express';
import prisma from '../prisma'; 

export const LembreteController = {

  /**
   * Rota: GET /api/lembretes
   * Busca todos os lembretes no banco de dados.
   */
  async buscarTodos(req: Request, res: Response) {
    try {
      const lembretes = await prisma.lembrete.findMany({
        orderBy: {
          data: 'desc', // mostra os mais novos primeiro
        },
      });
      return res.status(200).json(lembretes);
    } catch (err) {
      console.error('Erro ao buscar lembretes:', err);
      return res.status(500).json({ error: 'Erro interno ao buscar lembretes.' });
    }
  },

  /**
   * Rota: POST /api/lembretes
   * Cria um novo lembrete com base nos dados do frontend.
   */
  async criarLembrete(req: Request, res: Response) {
    try {
      // Pega os dados do corpo da requisição (o frontend envia)
      const { titulo, descricao, data, horaInicio, horaFim } = req.body;

      // Validação básica (o frontend já faz, mas o backend DEVE re-validar)
      if (!titulo || !data) {
        return res.status(400).json({ error: 'Título e Data são obrigatórios.' });
      }

      const novoLembrete = await prisma.lembrete.create({
        data: {
          titulo,
          descricao,
          data: new Date(data), // Converte a string "YYYY-MM-DD" para um objeto Date do JS
          horaInicio,
          horaFim,   
        },
      });

      // Retorna o lembrete que acabou de ser criado (o frontend usa isso)
      return res.status(201).json(novoLembrete);
    } catch (err) {
      console.error('Erro ao criar lembrete:', err);
      return res.status(500).json({ error: 'Erro interno ao criar lembrete.' });
    }
  },

  /**
   * Rota: DELETE /api/lembretes/:id
   * Remove um lembrete específico pelo seu ID.
   */
  async removerLembrete(req: Request, res: Response) {
    try {
      // O ID vem como parâmetro na URL (ex: /api/lembretes/123)
      const { id } = req.params;

      // O ID da URL é uma string, precisa converter para número
      const lembreteId = Number(id);

      // Busca se o lembrete existe antes de deletar
      const lembrete = await prisma.lembrete.findUnique({
        where: { id: lembreteId },
      });

      if (!lembrete) {
        return res.status(404).json({ error: 'Lembrete não encontrado.' });
      }

      // Deleta o lembrete
      await prisma.lembrete.delete({
        where: { id: lembreteId },
      });

      // Responde com sucesso (204 No Content - padrão para DELETE)
      return res.status(204).send();
    } catch (err) {
      console.error('Erro ao remover lembrete:', err);
      return res.status(500).json({ error: 'Erro interno ao remover lembrete.' });
    }
  },
};