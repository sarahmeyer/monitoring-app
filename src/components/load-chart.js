import * as React from 'react';
import PouchDB from 'pouchdb';


class LoadChart extends React.Component {
	state = {
		records: [],
	}

	componentDidMount() {
		const db = new PouchDB('http://localhost:5984/pouchdb__records');
		db.allDocs({
			include_docs: true,
		}).then((result) => {
			this.setState({
				records: result.rows,
			});
		}).catch((err) => {
			console.log('error fetching records', err);
		});
	}

	componentDidUpdate() {
		setTimeout(() => {
			const db = new PouchDB('http://localhost:5984/pouchdb__records');
			db.allDocs({
				include_docs: true,
			}).then((result) => {
				if (this.state.records.length !== result.rows.length) {
					this.setState({
						records: result.rows,
					});
				}
			}).catch((err) => {
				console.log('error fetching records', err);
			});
		}, 10000);
	}

	render() {
		return (
			<div>
				{
					this.state.records.map((record) => {
						return (
							<div key={`record_${record.id}`}>
								<span>{record.doc.oneMinuteLoad}</span>
								<span>{record.doc.fiveMinuteLoad}</span>
								<span>{record.doc.fifteenMinuteLoad}</span>
							</div>
						);
					})
				}
			</div>
		);
	}
}

export default LoadChart;
