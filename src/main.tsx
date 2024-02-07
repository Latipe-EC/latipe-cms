import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './stores/store.ts'
import PersistProvider from './stores/providers/persist-provider.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistProvider>
				<App />
			</PersistProvider>
		</Provider>
	</React.StrictMode>,
)
