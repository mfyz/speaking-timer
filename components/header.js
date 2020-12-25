import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = () => {
	const router = useRouter()
	return (
		<div className="header">
			<h3>⏱ Speaking Timer</h3>
		</div>
	)
}

export default Header