import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging();

export const requestForToken = () => {
	return getToken(messaging, { vapidKey: 'BLL1-N2my4yJIqckvQUV3tt-Pj40dWOv0bokqfi8z-YdRpRW4-tz0gzT3HOF_V4yOTsQbPo1yfWMQu6TjCR-kpo' })
		.then((currentToken) => {
			if (currentToken) {
				console.log('current token for client: ', currentToken);
				// Perform any other neccessary action with the token
			} else {
				// Show permission request UI
				console.log('No registration token available. Request permission to generate one.');
			}
		})
		.catch((err) => {
			console.log('An error occurred while retrieving token. ', err);
		});
};

export const onMessageListener = () =>
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			console.log("payload", payload)
			resolve(payload);
		});
	});
