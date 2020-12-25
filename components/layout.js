import Head from 'next/head'

import Header from './header'
import '../assets/styles.scss'

const Layout = (props) => (
	<div className={`layout ${props.className}`}>
		<Head>
        	<title>Speaker Timer</title>
		</Head>
		<Header />
		<div className="content">
			{props.children}
		</div>
	</div>
)

export default Layout