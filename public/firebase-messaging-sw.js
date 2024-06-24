self.addEventListener("push", (event) => {

	const notif = event.data.json().notification;
	event.waitUntil(self.registration.showNotification("Thông báo mơi", {
		body: notif.title,
		icon: notif.image,
		data: {
			url: notif.click_action
		}
	}));

});

self.addEventListener("notificationclick", (event) => {
	event.waitUntil(clients.openWindow(event.notification.data.url));
});

