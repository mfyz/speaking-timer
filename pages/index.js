import React, { Component } from "react"

import Layout from '../components/layout'

class Index extends Component {
	constructor(props) {
		super(props)

		this.state = {
			enabled: false,
			timer: 0
		}

		this.timer = null
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

	render() {
		const { enabled, timer } = this.state

		const minutes = Math.floor(timer / 60)
		let minutesStr = minutes
		if (minutes < 10) minutesStr = '0' + minutesStr;
		const seconds = timer % 60
		let secondsStr = seconds
		if (seconds < 10) secondsStr = '0' + secondsStr;

		let uiClasses = []
		if (
			minutes > 0
			&& minutes % 5 == 0 // every 5 minutes
			&& seconds < 20     // for 20 seconds
			&& seconds % 2 == 0 // flash
		) {
			uiClasses.push('orange')
		}

		return (
			<Layout className={`mainTimerUI ${uiClasses.join(' ')}`}>
				<h1 class="timer">{`${minutesStr}:${secondsStr}`}</h1>
				{!enabled && (
					<button onClick={this.startTimer.bind(this)}>Start</button>
				)}
				{enabled && (
					<button class="red" onClick={this.stopTimer.bind(this)}>Stop</button>
				)}
			</Layout>
		)
	}
}

export default Index