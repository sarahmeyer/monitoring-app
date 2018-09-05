import * as React from 'react';
import moment from 'moment';
import PouchDB from 'pouchdb';
import { scaleLinear, scaleTime } from 'd3-scale';
import { sortBy } from 'underscore';

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;
const DEFAULT_MINUTES = 10;

class LoadChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			records: [],
		};
	}

	xScale() {
	    const now = moment();
	    const minutesAgo = moment().subtract(DEFAULT_MINUTES, 'minutes');

		return scaleTime()
		    .domain([minutesAgo.toDate(), now.toDate()])
		    .range([0, DEFAULT_WIDTH]);
	}

	yScale() {
		const records = this.recordsInTimeframe();

		let lowestLoad = 0;
		let highestLoad = 0;

		for (const index in records) {
			const doc = records[index].doc;
			lowestLoad = Math.min(
				doc.oneMinuteLoad,
				doc.fiveMinuteLoad,
				doc.fifteenMinuteLoad,
				lowestLoad
			);
			highestLoad = Math.max(
				doc.oneMinuteLoad,
				doc.fiveMinuteLoad,
				doc.fifteenMinuteLoad,
				highestLoad
			);
		}

		return scaleLinear()
		    .domain([lowestLoad, highestLoad])
		    .range([0, DEFAULT_HEIGHT]);
	}

	recordsInTimeframe() {
	    const now = moment();
	    const minutesAgo = moment().subtract(DEFAULT_MINUTES, 'minutes');

		return this.state.records.filter((record) => {
			return minutesAgo.utc().valueOf() < record.doc.timestamp
				&& record.doc.timestamp < now.utc().valueOf();
		});
	}

	setupCanvas() {
	    const canvas = this.refs.canvas;
	    const ctx = canvas.getContext("2d");

	    const canvasWidth = canvas.attributes.width.value;
	    const canvasHeight = canvas.attributes.height.value;

		ctx.beginPath();
		ctx.moveTo(0, canvasHeight);
		ctx.lineTo(canvasWidth, canvasHeight);
		ctx.stroke();

		for (let i = 0; i < DEFAULT_MINUTES; i ++) {
			const barWidth = DEFAULT_WIDTH / DEFAULT_MINUTES;
			const x = (i * barWidth) + (barWidth / 2);
			ctx.moveTo(x, canvasHeight);
			ctx.lineTo(x, canvasHeight - 10);
			ctx.stroke();
		}
	}

	plotRecordsOnCanvas(records) {
		if (records.length < 2) {
			return;
		}

	    const canvas = this.refs.canvas;
	    const ctx = canvas.getContext("2d");

		const recordsInTimeframe = this.recordsInTimeframe();

		for (const index in recordsInTimeframe) {
			const doc = recordsInTimeframe[index].doc;

			const x = this.xScale()(moment.utc(doc.timestamp));
			const y1 = this.yScale()(moment.utc(doc.oneMinuteLoad));
			const y2 = this.yScale()(moment.utc(doc.fiveMinuteLoad));
			const y3 = this.yScale()(moment.utc(doc.fifteenMinuteLoad));

			console.log('oneMinuteLoad', doc.oneMinuteLoad, y1,
				'fiveMinuteLoad', doc.fiveMinuteLoad, y2,
				'fifteenMinuteLoad', doc.fifteenMinuteLoad, y3);

			ctx.beginPath();
			ctx.fillStyle = 'blue';
			ctx.arc(x, y1, 2, 0, Math.PI * 2, false)
			ctx.stroke();

			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.arc(x, y2, 2, 0, Math.PI * 2, false)
			ctx.stroke();

			ctx.beginPath();
			ctx.fillStyle = 'green';
			ctx.arc(x, y3, 2, 0, Math.PI * 2, false)
			ctx.stroke();
		}
	}

	fetchRecords() {
		const { records } = this.state;

		const db = new PouchDB('http://localhost:5984/pouchdb__records');
		db.allDocs({
			include_docs: true,
		}).then((result) => {
			if (records.length !== result.rows.length) {
				this.setState({
					records: result.rows,
				}, () => {
					this.plotRecordsOnCanvas(result.rows);
				});
			}
		}).catch((err) => {
			console.log('error fetching records', err);
		});
	}

	componentDidMount() {
		this.fetchRecords();

		this.setupCanvas();
	}

	componentDidUpdate() {
		setTimeout(() => {
			this.fetchRecords();
		}, 10000);
	}

	render() {
		return (
			<div>
				<canvas ref="canvas" width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} />
			</div>
		);
	}
}

export default LoadChart;
