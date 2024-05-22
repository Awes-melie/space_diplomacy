# API Design

- GET `/` - health endpoint
- GET `/api/v1`
- POST `/api/v1/auth/*` - routes to authenticate and create users
- GET `/api/v1/games` - Lists all games

## Game info

- POST `/api/v1/games/create` - Setup new game
  ```
    {
      name: String
      email: String (host)
      privateSession: boolean
    }
  ```
- GET `/api/v1/games/:gameId` - gets game state

  ```
    {
      name: String
      status: int (forming, running, paused, ended)
      winners?: [String]
    }
  ```

- DELETE `.../:gameId` - deletes a game (only permitted by game creator)

### Settings

- GET `.../:gameId/settings` - gets game settings

  ```
    {
      private: Bool
      adjudicationTime: Time
      longAdjudication: float (seconds, Spring and Autumn)
      shortAdjudication: float (seconds, Retreats and Winter)
    }
  ```

- POST `.../:gameId/settings` - updates game settings, equivalent to above

### Topology

- GET `.../:gameId/topology` - gets game topography information (static)

  ```
    {
      nodes: int (number of nodes)
    }
  ```

- GET `.../:gameId/topology/:nodeId` - gets information about a given node (static)

  ```
    {
      name: String
      sc: bool
      homeSc?: int (home power ID)
    }
  ```

- GET `.../:gameId/topology/:nodeId/position` - gets information about a given node (static)

  ```
    {
      x: int
      y: int
      z: int
    }
  ```

- GET `.../:gameId/topology/:nodeId/edges` - gets list of edges between nodes (undirected graph) (static)
  ```
    {
      edges: [int]
    }
  ```

### Player data

- POST `.../:gameId/players` - join a game (Can invite players if host)

- GET `.../:gameId/players` - gets current players (static when game starts)

  ```
    {
      players: [String] (player usernames)
    }
  ```

- DELETE `.../:gameId/players` - quit a game

- GET `.../:gameId/powers` - Gets information about powers (anonymised player characters) (static when game starts)
  ```
    {
      powers: [
        {
          name: String
          colour: String
        }
      ]
    }
  ```

## Game state

- POST `.../:gameId/state` - start a game (only permitted by game creator)

- GET `.../:gameId/state` - gets current game state

  ```
    {
      time: int
    }
  ```

- GET `.../:gameId/state/:nodeId` - gets current state of a node

  ```
    {
      owner: String (if sc node)
      unit: String (of unit owner)
    }
  ```

- GET `.../:gameId/state/powers/:power` - Returns the state of a given power
  ```
    {
      state: int (defeated, active)
    }
  ```

`Order` Message:

```
  {
    type: int (move, hold, support)
    from?: int (Territory id to act from (Only used for support orders, -1 otherwise))
    to?: int (Territory id to act to (For move and support orders, -1 otherwise))
  }
```

- GET `.../:gameId/state/:nodeId/order` - gets current node's order (Only returns anything for nodes matching player)
  Gets an Order

- POST `.../:gameId/state/:nodeId/order` - send a move update (only valid on owned nodes)
  Posts an Order

### History

- GET `.../:gameId/:time` - gets game state at a previous time
  Same as for getting /state but all orders regardless of power can be seen and /order/result contains a result (int) flag.

### Messages

- POST `.../:gameId/threads` - create new message thread

  ```
    {
      name: String
      members: [String]
    }
  ```

- GET `.../:gameId/threads/:threadId` - gets information about a thread

  ```
    {
      name: String
      members: [String]
    }
  ```

- GET `.../:gameId/threads/:threadId/:messageID` - gets message from a thread

  ```
    {
      sender_id: String
      contents: String
      time: int (time message was sent)
    }
  ```

- POST `.../:gameId/threads/:threadId` - send new message to thread
  ```
    {
      message: String
    }
  ```
