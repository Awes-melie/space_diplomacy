import { useState } from 'react';
import { api } from '../backend_hook';

export const Register = () => {
	const [email, setEmail] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const onEmailChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
		setEmail(ev.target.value);
		setErrorMessage('');
	};
	const onDisplayNameChange: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		setDisplayName(ev.target.value);
		setErrorMessage('');
	};

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
		ev.preventDefault();
		const { error } = await api('/auth/register', {
			method: 'POST',
			body: { email, displayName },
		});
		if (error) setErrorMessage(error.message);
	};
	return (
		<>
			<form onSubmit={onSubmit}>
				<label htmlFor="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					value={email}
					onChange={onEmailChange}
				/>
				<br />
				<label htmlFor="display-name">
					Display Name / Gamer Handle
				</label>
				<input
					id="display-name"
					name="display-name"
					value={displayName}
					onChange={onDisplayNameChange}
				/>
				<br />
				<button type="submit">Submit</button>
				{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
			</form>
		</>
	);
};
