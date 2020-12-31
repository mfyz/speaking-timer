import Head from 'next/head'

import Header from './header'
import '../assets/styles.scss'

const Layout = (props) => (
	<div className={`layout ${props.className}`}>
		<Head>
        	<title>Speaker Timer</title>
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="black" />
			<meta name="viewport" content="viewport-fit=cover, user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1" />
		</Head>
		<Header />
		<div className="content">
			{props.children}
		</div>
	</div>
)

export default Layout