import { useEffect, useState } from 'react';
import './App.css';
import { api } from './backend_hook.ts';
import 'vite/modulepreload-polyfill';
import { Link } from 'react-router-dom';
import { Page } from './components/Page.styled.tsx';

type GameState = { count: number };

function App() {
	const [count, setCount] = useState(0);

	async function clickButton() {
		console.log('Clicked! Notifying backend.');
		const { data, error } = await api<GameState>('/inc', {
			method: 'POST',
		});
		if (data && !error) {
			console.log('New value Recieved ' + data.count);
			setCount(data.count);
		}
	}

	useEffect(() => {
		// this function is called when the app mounts
		console.log('App mounted fetching initail count');
		(async () => {
			// this is a self-calling asynchronous function
			const { data, error } = await api<GameState>('/');

			if (data && !error) {
				setCount(data.count);
			}
		})();
	}, []);

	return (
		<Page>
			<h1>Space Diplomacy</h1>
			<Link to="/auth/register">Register</Link>
			<div className="card">
				<button onClick={clickButton}>count is {count}</button>
			</div>
		</Page>
	);
}

export default App;
