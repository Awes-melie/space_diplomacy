import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Register } from './pages/Register.tsx';
import { CreateGame } from './pages/CreateGame.tsx';
import { Game } from './pages/Game.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/auth/register',
		element: <Register />,
	},
	{
		path: '/games/',
		element: <CreateGame />, //Temporary
	},
	{
		path: '/games/create',
		element: <CreateGame />,
	},
	{
		path: '/games/:gameId',
		element: <Game />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
