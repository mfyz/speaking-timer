import React, { Component } from 'react'
import NoSleep from 'nosleep.js'

import Layout from '../components/layout'

class Index extends Component {
	constructor(props) {
		super(props)

		this.state = {
			enabled: false,
			started_at: null,
			timer: 0,
			flashInterval: 5,
			checkpoints: []
		}

		this.timerInterval = null
		this.noSleep = null
	}

	componentDidMount() {
		this.noSleep = new NoSleep()
	}

	startTimer() {
		this.noSleep.enable()
		this.setState({
			enabled: true,
			started_at: Date.now() / 1000
		})
		this.timerInterval = setInterval(() => {
			const timerNew = Math.round((Date.now() / 1000) - this.state.started_at)
			this.setState({ timer: timerNew })
		}, 200)
	}

	stopTimer() {
		this.setState({
			enabled: false,
		})
		clearInterval(this.timerInterval)
		this.noSleep.disable()
	}

	resetTimer() {
		this.stopTimer()
		this.setState({
			timer: 0
		})
	}

	recordCheckpoint() {
		const updateCheckpoints = [...this.state.checkpoints, Date.now() / 1000]
		this.setState({
			checkpoints: updateCheckpoints
		})
	}

	changeFlashInterval(e) {
		this.setState({
			flashInterval: e.target.value
		})
	}

	render() {
		const { enabled, timer, flashInterval, started_at, checkpoints } = this.state

		const minutes = Math.floor(timer / 60)
		let minutesStr = minutes
		if (minutes < 10) minutesStr = '0' + minutesStr;
		const seconds = timer % 60
		let secondsStr = seconds
		if (seconds < 10) secondsStr = '0' + secondsStr;

		let uiClasses = []
		if (
			flashInterval > 0
			&& minutes > 0
			&& minutes % flashInterval == 0 // every [5] minutes
			&& seconds < 20 // for 20 seconds
			&& seconds % 2 == 0 // flash
		) {
			uiClasses.push('orange')
		}

		let previousCheckpoint = null

		return (
			<Layout className={`mainTimerUI ${uiClasses.join(' ')}`}>
				<h1 className="timer">{`${minutesStr}:${secondsStr}`}</h1>
				<div>
					{!enabled && (
						<button onClick={this.startTimer.bind(this)}>Start</button>
					)}
					{enabled && (
						<>
							<button onClick={this.recordCheckpoint.bind(this)}>Checkpoint</button>
							<button className="red" onClick={this.stopTimer.bind(this)}>Stop</button>
						</>
					)}
					<button className="gray" onClick={this.resetTimer.bind(this)}>Reset</button>
				</div>
				<div className="flashIntervalWrapper">
					Flash in every
					<input type="number" onChange={this.changeFlashInterval.bind(this)} value={flashInterval} />
					minutes
				</div>
				{checkpoints.length > 0 && (
					<div className="checkpoints">
						<ul>
							{checkpoints.map((checkpoint) => {
								const diffSecs = Math.floor(checkpoint - started_at)
								let strDiffMins = diffSecs > 60 ? Math.floor(diffSecs / 60) : 0
								if (strDiffMins < 10) strDiffMins = '0' + strDiffMins
								let strDiffSecs = Math.floor(diffSecs % 60)
								if (strDiffSecs < 10) strDiffSecs = '0' + strDiffSecs
								let strDiff = strDiffMins + ':' + strDiffSecs

								if (previousCheckpoint) {
									let diffSecsFromLastCheckpoint = Math.floor(checkpoint - previousCheckpoint)
									if (diffSecsFromLastCheckpoint > 60) diffSecsFromLastCheckpoint = Math.floor(diffSecsFromLastCheckpoint / 60) + 'm'
									else diffSecsFromLastCheckpoint += 's'
									strDiff += ' (+' + diffSecsFromLastCheckpoint + ')'
								}

								previousCheckpoint = checkpoint
								
								return (
									<li key={checkpoint}>
										{strDiff}
									</li>
								)
							})}
						</ul>
					</div>
				)}
			</Layout>
		)
	}
}

export default Index