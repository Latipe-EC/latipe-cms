import { PaymentMethodName, ToastStatus } from "@/utils/constants";
import { themeGet } from "@styled-system/theme-get";
import { differenceInMinutes } from "date-fns";
import { ceil } from "lodash";

export const getTheme = (query: string, fallback?: string) =>
	themeGet(query, fallback);

export const convertHexToRGB = (hex) => {
	// check if it's a rgba
	if (hex.match("rgba")) {
		return hex.slice(5).split(",").slice(0, -1).join(",");
	}

	let c;

	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split("");
		if (c.length === 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = "0x" + c.join("");

		return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",");
	}
};

export function truncateFilename(file: File, maxWords: number): string {
	// Split the filename into name and extension

	const filename = file.name ? file.name : "image.png";
	const [name, extension] = filename.split('.');

	// Split the name into words
	const words = name.split(' ');

	// If the name is longer than maxWords, truncate it and add '...'
	const truncatedName = words.length > maxWords
		? `${words.slice(0, maxWords).join(' ')}...`
		: name;

	// Return the truncated name with the extension
	return `${truncatedName}.${extension}`;
}

export const getDateDifference = (date) => {
	let diff = differenceInMinutes(new Date(), new Date(date));

	if (diff < 60) return diff + " minutes ago";

	diff = ceil(diff / 60);
	if (diff < 24) return `${diff} hour${diff === 0 ? "" : "s"} ago`;

	diff = ceil(diff / 24);
	if (diff < 30) return `${diff} day${diff === 0 ? "" : "s"} ago`;

	diff = ceil(diff / 30);
	if (diff < 12) return `${diff} month${diff === 0 ? "" : "s"} ago`;

	diff = diff / 12;
	return `${diff.toFixed(1)} year${ceil(diff) === 0 ? "" : "s"} ago`;
};

export const convertDateYYYYMMDD = (date) => {
	const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
	return dateString
};

export function convertDateTimeYYYYMMDD(dateString: string): string {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0 based. Add leading 0 and slice last 2 digits
	const day = ('0' + date.getDate()).slice(-2);
	const hours = ('0' + date.getHours()).slice(-2);
	const minutes = ('0' + date.getMinutes()).slice(-2);
	const seconds = ('0' + date.getSeconds()).slice(-2);

	return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

export function getMonthDifference(startDate, endDate) {
	return (
		endDate.getMonth() -
		startDate.getMonth() +
		12 * (endDate.getFullYear() - startDate.getFullYear())
	);
}

export function getPaymentMethod(method: string): number {
	return method === PaymentMethodName.COD ? 1 : method === PaymentMethodName.PayPal ? 2 : 3;
}

export const handleApiCallWithToast =
	(
		dispatch,
		apiCall,
		request,
		navigationPath,
		titleProccess,
		titleSuccess,
		contentSuccess,
		titleError,
		contentError,
		navigate,
		toast,
		Spinner,
		CallbackSuccess = null,
		CallbackError = null
	) => {
		const loadingToastId = toast({
			title: titleProccess,
			description: Spinner,
			status: ToastStatus.INFO,
			duration: null,
			isClosable: true,
			position: "top-right",
		});

		dispatch(apiCall(request))
			.unwrap()
			.then((res) => {
				toast.close(loadingToastId);
				if (res.status.toString().includes("20")) {
					toast({
						title: titleSuccess,
						description: contentSuccess,
						status: ToastStatus.SUCCESS,
						duration: 2000,
						isClosable: true,
						position: "top-right",
					});
					if (CallbackSuccess)
						CallbackSuccess(res);
					setTimeout(() => {
						if (navigationPath)
							navigate(navigationPath);
					}, 2500);
				} else {
					toast({
						title: titleError,
						description: contentError,
						status: ToastStatus.ERROR,
						duration: 2000,
						isClosable: true,
						position: "top-right",
					});
					if (CallbackError)
						CallbackError(res);
				}
			}).catch(() => {
				toast.close(loadingToastId);
				toast({
					title: titleError,
					description: contentError,
					status: ToastStatus.ERROR,
					duration: 2000,
					isClosable: true,
					position: "top-right",
				});
				if (CallbackError)
					CallbackError();
			});
	};
