import express from "express";
import { Game } from "../models/Game";
import { ErrorMessage } from "../middlewares";

const gameRouter = express.Router();

gameRouter.post<{}, unknown>("/create", async (req, res) => {
  const newGame = await Game.create(
    req.body.displayName,
    req.body.privateSession,
    req.body.email
  );
  res.json(newGame);
});

export default gameRouter;
