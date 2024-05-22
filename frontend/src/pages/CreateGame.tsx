import { useState } from 'react';
import { api } from '../backend_hook';

export const CreateGame = () => {
	const [displayName, setName] = useState('');
	const [privateSession, setPrivacy] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	const onDisplayNameChange: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		setName(ev.target.value);
		setErrorMessage('');
	};

	const onPrivacyChange: React.ChangeEventHandler<HTMLInputElement> = () => {
		setPrivacy(!privateSession);
		setErrorMessage('');
	};

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
		ev.preventDefault();
		const { error } = await api('/games/create', {
			method: 'POST',
			body: {
				displayName,
				privateSession,
				email: 'amelietdavies@gmail.com',
			},
		});
		if (error) setErrorMessage(error.message);
	};
	return (
		<>
			<form onSubmit={onSubmit}>
				<label htmlFor="display-name">Game Name</label>
				<input
					id="display-name"
					name="display-name"
					value={displayName}
					onChange={onDisplayNameChange}
				/>
				<br />
				<label htmlFor="private-session">Private Session</label>
				<input
					id="private-session"
					name="private-session"
					type="checkbox"
					checked={privateSession}
					onChange={onPrivacyChange}
				/>
				<br />
				<button type="submit">Submit</button>
				{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
			</form>
		</>
	);
};
