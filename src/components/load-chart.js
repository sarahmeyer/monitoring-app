import * as React from 'react';
import PouchDB from 'pouchdb';
import { scaleTime } from 'd3-scale';

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;

class LoadChart extends React.Component {
	state = {
		records: [],
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
	}

	drawTicks(records) {

	}

	plotRecordsOnCanvas(records) {
	    const canvas = this.refs.canvas;
	    const ctx = canvas.getContext("2d");

	    const canvasWidth = canvas.attributes.width.value;
	    const canvasHeight = canvas.attributes.height.value;
		debugger;

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
		setTimeout(this.fetchRecords, 10000);
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
