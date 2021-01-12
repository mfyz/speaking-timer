import React, { Component } from 'react'
import NoSleep from 'nosleep.js'

import Layout from '../components/layout'

const predefinedOutlines = [
	{
		label: 'BhS', // 5 mins
		outlineText: `
			0.5m Clarify
			1m   Context
			1m   Situation
			1m   Action
			1m   Result
			0.5m Learning
		`
	}, {
		label: 'M', // 15 mins
		outlineText: `
			1m Clarify
			2m Context
			4m Situation
			4m Action
			2m Result
			2m Learning
		`
	}, {
		label: 'L', // 30 mins
		outlineText: `
			2m Clarify
			5m Context
			7m Situation
			7m Action
			5m Result
			3m Learning
		`
	}, {
		label: 'St', // 45 mins
		outlineText: `
			4m Clarify
			3m Who are WE & Strengths
			3m COMPETITION
			5m Who are the USERS & Segments
			4m GOALS (User, Biz)
			7m PAIN POINTS
			3m PRIORITIZATION
			7m SOLUTION / DIRECTION
			3m MVP
			3m SUCCESS / KPIs
			3m GTM
		`
	}, {
		label: 'PD', // 45 mins
		outlineText: `
			4m Clarify
			3m Who are WE & Strengths
			3m COMPETITION
			5m Who are the USERS & Segments
			4m GOALS (User, Biz)
			7m PAIN POINTS
			3m PRIORITIZATION
			7m SOLUTION
			3m MVP
			3m SUCCESS / KPIs
			3m GTM
		`
	}, {
		label: 'Ax', // 45 mins
		outlineText: `
			5m Intro/Agenda
			20m Review Resume
			10m Company Matrix
			20m Prep Status Review
			10m Answer Structures
			10m Referals strategy
			15m Attack strategy
			1m Talking style
		`
	},
]

class Index extends Component {
	constructor(props) {
		super(props)

		this.state = {
			enabled: false,
			started_at: null,
			timer: 0,
			flashInterval: 5,
			checkpoints: [],
			showSettings: false,
			outlineFormVisible: false,
			outlineTextarea: null, 
			meetingTimeSeconds: 0,
			outlines: []
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
			timer: 0,
			meetingTimeSeconds: 0,
			outlineFormVisible: false,
			outlineText: null,
			outlines: []
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

	toggleSettings() {
		this.setState({
			showSettings: !this.state.showSettings
		})
	}

	showOutlineForm(outlineText) {
		const cleanOutlineText = outlineText ? outlineText.trim()
			.split('\n')
			.map(t => t.trim())
			.join('\n')
			: ''

		this.setState({
			outlineFormVisible: true,
			outlineTextarea: cleanOutlineText
		})
	}

	setOutline() {
		const { outlineTextarea } = this.state
		const outlineRows = outlineTextarea.trim().split('\n').map(t => t.trim())
		const outlines = []
		let currentMarkSeconds = 0
		outlineRows.map((outlineRow) => {
			let timing = outlineRow.substr(0, outlineRow.indexOf(' ')).replace('m', '')
			if (timing.indexOf('s') !== -1) timing = parseInt(timing, 10) / 60 // handle seconds
			let label = outlineRow.substr(outlineRow.indexOf(' ') + 1).trim()
			if (parseFloat(timing, 10) > 0) timing = parseFloat(timing, 10)
			else { label = timing + ' ' + label; timing = 1 } // no marks, default to 1m
			currentMarkSeconds += (timing * 60)
			outlines.push({ mark: currentMarkSeconds, timing, label })
			return outlineRow
		})
		// console.log(outlines)
		this.setState({
			showSettings: false,
			outlineFormVisible: false,
			meetingTimeSeconds: currentMarkSeconds,
			outlines
		})
	}

	render() {
		const {
			enabled, timer, flashInterval, started_at, checkpoints, showSettings,
			outlineTextarea, outlineFormVisible, outlines, meetingTimeSeconds
		} = this.state

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

		let minutesLeftStr = '00'
		let secondsLeftStr = '00'
		if (meetingTimeSeconds && timer > meetingTimeSeconds) {
			uiClasses.push('overtime')
		}
		else {
			const timeLeftSeconds = meetingTimeSeconds - timer
			const minutesLeft = Math.floor(timeLeftSeconds / 60)
			minutesLeftStr = minutesLeft
			if (minutesLeft < 10) minutesLeftStr = '0' + minutesLeftStr;
			const secondsLeft = timeLeftSeconds % 60
			secondsLeftStr = secondsLeft
			if (secondsLeft < 10) secondsLeftStr = '0' + secondsLeftStr;
		}

		let previousCheckpoint = null
		let totalSecs = 0

		return (
			<Layout className={`mainTimerUI ${uiClasses.join(' ')}`}>
				<div className="timers">
					<h1 className="timer">{`${minutesStr}:${secondsStr}`}</h1>
					{meetingTimeSeconds > 0 && (
						<h3 className={`timeLeft ${timer > (meetingTimeSeconds - 300) ? 'under5minsLeft ' : ''}`}>
							{`-${minutesLeftStr}:${secondsLeftStr}`}&nbsp;
						</h3>
					)}
				</div>
				<div>
					{!enabled && (
						<button onClick={this.startTimer.bind(this)}>Start</button>
					)}
					{enabled && (
						<>
							<button className="gray" onClick={this.recordCheckpoint.bind(this)}>✓</button>
							<button className="gray" onClick={this.stopTimer.bind(this)}>▉</button>
						</>
					)}
					<button className="gray" onClick={this.resetTimer.bind(this)}>⨉</button>
					<button className="gray" onClick={this.toggleSettings.bind(this)}>⚙</button>
				</div>
				{showSettings && (
					<div className="settingsWrapper">
						<div className="flashIntervalWrapper">
							Flash in every
							<input type="number" onChange={this.changeFlashInterval.bind(this)} value={flashInterval} />
							minutes
						</div>
						<div className="outlinesSettings">
							<div className="options">
								{predefinedOutlines.map((outline) => (
									<a
										key={outline.label}
										className={`o_` + outline.label}
										onClick={() => { this.showOutlineForm(outline.outlineText) }}
									>
										{outline.label}
									</a>
								))}
								<a className="cu" onClick={() => { this.showOutlineForm() }}>Cu</a>
							</div>
							{outlineFormVisible && (
								<div className="outlineForm">
									<textarea
										value={outlineTextarea}
										onChange={(e) => { this.setState({ outlineTextarea: e.target.value }) }}
									/>
									<button onClick={this.setOutline.bind(this)}>Set Outline</button>
								</div>
							)}
						</div>
					</div>
				)}
				<div className="outlines">
					{outlines.length > 0 && (
						<ul className="outlinesList">
							{outlines.map((outline) => {
								const isCurrent = timer > totalSecs && timer <= totalSecs + (outline.timing * 60)
								totalSecs += (outline.timing * 60)
								return (
									<li
										key={outline.label}
										className={`${timer > totalSecs ? 'completed' : ''} ${isCurrent ? ' isCurrent' : ''}`}
									>
										{timer > totalSecs && (
											<span>✅ </span>
										)}
										{`${outline.timing}`.substr(0, 3)}m
										&middot;&nbsp;
										{outline.label}
									</li>
								)
							})}
							<li className={`total ` + (timer > totalSecs ? 'overtime' : '')}>
								Total {Math.round(totalSecs / 60)}m
							</li>
						</ul>
					)}
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