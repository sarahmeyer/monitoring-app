const PouchDB = require('pouchdb');
const { spawn } = require('child_process');

const db = new PouchDB('http://localhost:5984/pouchdb__records');

setInterval(() => {
	const uptime = spawn('uptime');

	uptime.stdout.on('data', (data) => {
		const timestamp = (new Date()).valueOf();
		const tokens = data.toString().split(' ').filter((token) => token.length > 0);
		const oneMinuteLoad = parseFloat(tokens[tokens.length - 3], 10);
		const fiveMinuteLoad = parseFloat(tokens[tokens.length - 2], 10);
		const fifteenMinuteLoad = parseFloat(tokens[tokens.length - 1], 10);
		const uptimeRecord = {
			_id: timestamp.toString(),
			timestamp,
			oneMinuteLoad,
			fiveMinuteLoad,
			fifteenMinuteLoad,
		}
		console.log(uptimeRecord);
		db.put(uptimeRecord).then((info) => {
			console.log('record successfully inserted', info);
		}).then(function () {
		  return db.allDocs({include_docs: true});
		}).catch((err) => {
			console.log('record insertion error error', err);
		}).then(function (response) {
		  console.log(`response is ${response}`);
		}).catch(function (err) {
		  console.log(err);
		});
	});

	uptime.stderr.on('data', (data) => {
		console.log(`uptime stderr: ${data}`);
	});

	uptime.on('close', (code) => {
		console.log(`uptime child process exited with code ${code}`);
	});
}, 10000);

