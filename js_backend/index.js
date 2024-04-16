const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const frontendHost = 'http://localhost:4000';

app.use(cors({ origin: frontendHost }));

var count = 0;
app.get('/', (req, res) => {
	res.json({ count });
});

app.post('/inc', (req, res) => {
	count += 1;
	res.json({ count });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
