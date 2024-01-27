import './App.css'
import { FrappeProvider } from 'frappe-react-sdk'
function App() {
	const getSiteName = () => {
		// Get sitename from boot for Frappe v15 and above
		if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
			return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME
		}
		return import.meta.env.VITE_SITE_NAME
	}

  return (
		<FrappeProvider
			socketPort={import.meta.env.VITE_SOCKET_PORT}
			siteName={getSiteName()}
		>
			<div className="App">
				Hello!
			</div>
		</FrappeProvider>
  )
}

export default App
