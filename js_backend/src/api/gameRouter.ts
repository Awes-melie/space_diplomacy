import express, { Request } from 'express';
import { Game } from '../models/Game';
import { ErrorMessage } from '../middlewares';

const gameRouter = express.Router();

gameRouter.post<{}, unknown>('/create', async (req, res) => {
	const newGame = await Game.create(
		req.body.displayName,
		req.body.privateSession,
		req.body.email
	);
	res.json(newGame);
});

gameRouter.get<{}, Game>('/:gameId', async (req: Request, res) => {
	const game = await Game.find_game(req.params.gameId);
	if (game) {
		res.json(game);
	}
});

export default gameRouter;
