import { useEffect, useState } from 'react';
import { api } from '../backend_hook';
import { useParams } from 'react-router-dom';
import { Page404 } from './Page404';

type Game = { displayName: string; privateSession: boolean };

export const Game = () => {
	const { gameId } = useParams();

	const [displayName, setName] = useState('');
	const [privateSession, setPrivacy] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		(async () => {
			// this is a self-calling asynchronous function
			const { data, error } = await api<Game>('/games/' + gameId);

			if (data && !error) {
				setName(data.displayName);
				setPrivacy(data.privateSession);
			} else {
				setNotFound(true);
			}
		})();
	}, [gameId]);

	if (notFound) {
		return <Page404 />;
	}
	return (
		<>
			<h1>{displayName}</h1>
			<PrivacyMark privateSession={privateSession} />
		</>
	);
};

const PrivacyMark = (params: { privateSession: boolean }) => {
	if (params.privateSession) {
		return (
			<>
				<p>(private)</p>
			</>
		);
	} else {
		return <></>;
	}
};
