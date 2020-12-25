import React, { Component } from 'react'
import NoSleep from 'nosleep.js'

import Layout from '../components/layout'

class Index extends Component {
	constructor(props) {
		super(props)

		this.state = {
			enabled: false,
			timer: 0,
			flashInterval: 5
		}

		this.timer = null
	}

	componentDidMount() {
		const noSleep = new NoSleep()
		noSleep.enable()
	}

	startTimer() {
		this.setState({
			enabled: true,
		})
		this.timer = setInterval(() => {
			this.setState({
				timer: this.state.timer + 1
			})
		}, 1000)
	}

	stopTimer() {
		this.setState({
			enabled: false,
		})
		clearInterval(this.timer)
	}

	resetTimer() {
		this.stopTimer()
		this.setState({
			timer: 0
		})
	}

	changeFlashInterval(e) {
		this.setState({
			flashInterval: e.target.value
		})
	}

	render() {
		const { enabled, timer, flashInterval } = this.state

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

		return (
			<Layout className={`mainTimerUI ${uiClasses.join(' ')}`}>
				<h1 className="timer">{`${minutesStr}:${secondsStr}`}</h1>
				<div>
					{!enabled && (
						<button onClick={this.startTimer.bind(this)}>Start</button>
					)}
					{enabled && (
						<button className="red" onClick={this.stopTimer.bind(this)}>Stop</button>
					)}
					&nbsp;
					<button className="gray" onClick={this.resetTimer.bind(this)}>Reset</button>
				</div>
				<div className="flashIntervalWrapper">
					Flash in every
					<input type="number" onChange={this.changeFlashInterval.bind(this)} value={flashInterval} />
					minutes
				</div>
			</Layout>
		)
	}
}

export default Index