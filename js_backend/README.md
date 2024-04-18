## API Design

-   GET `/` - health endpoint
-   GET `/api/v1`
-   POST `/api/v1/auth/*` - routes to authenticate and create users
-   POST `/api/v1/games` - create a new game
-   POST `/api/v1/games/:gameId/join` - join a game
-   POST `/api/v1/games/:gameId/start` - start a game (only permitted by game creator) - assignes players to random identifiers for this game (everyone is anonymous)
-   GET `/api/v1/games/:gameId` - gets game state
-   POST `/api/v1/games/:gameId` - send a player update
-   DELETE `/api/v1/games/:gameId` - deletes a game (only permitted by game creator)
