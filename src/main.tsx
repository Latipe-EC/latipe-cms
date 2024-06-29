import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './stores/store.ts'
import PersistProvider from './stores/providers/persist-provider.tsx'
import { getMessaging, getToken } from 'firebase/messaging'
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Api } from '@/api/AxiosClient.ts'
import { generateUUID } from '@/utils/utils.ts'

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const api = new Api();

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('./firebase-messaging-sw.js').then(registration => {
			if (Notification.permission === 'granted') {
				getTokenAndLog();
			} else if (Notification.permission !== 'denied') {
				Notification.requestPermission().then(permission => {
					if (permission === 'granted') {
						getTokenAndLog();
					}
				});
			}

			function getTokenAndLog() {
				getToken(messaging, {
					serviceWorkerRegistration: registration,
					vapidKey: 'BLL1-N2my4yJIqckvQUV3tt-Pj40dWOv0bokqfi8z-YdRpRW4-tz0gzT3HOF_V4yOTsQbPo1yfWMQu6TjCR-kpo'
				}).then(async (currentToken) => {
					if (currentToken) {

						if (localStorage.getItem('device_notification_token') === currentToken) {
							return;
						}

						await api.notification.registerNewDevice({
							"device_info": navigator.userAgent,
							"device_token": currentToken,
							"device_type": 1
						})
						localStorage.setItem('device_notification_token', currentToken);
						localStorage.setItem('browser_id', generateUUID());

					} else {
						// Show permission request UI
						console.log('No registration token available. Request permission to generate one.');
						// ...
					}
				}).catch((err) => {
					console.log('An error occurred while retrieving token. ', err);
					// show a message and UI element to let the user know what went wrong
					// ...
				});
			}
		});
	});
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistProvider>
				<App />
			</PersistProvider>
		</Provider>
	</React.StrictMode>,
)
