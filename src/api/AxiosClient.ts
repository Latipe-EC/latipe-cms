import {
	CountAllOrderResponse,
	CreateOrderV2Request,
	GetTotalCommissionAdminResponse,
	UpdateOrderByDeliveryRequest
} from './interface/order';
import { PagedResultResponse } from '@interfaces/PagedResultResponse';
import {
	FinishVerifyAccountRequest,
	ForgotPasswordRequest,
	LoginRequest,
	LoginResponse,
	RefreshTokenInput,
	RefreshTokenResponse,
	RegisterAccountRequest,
	ResetPasswordRequest,
	VerifyAccountRequest
} from '../api/interface/auth';
import {
	CreateUserAddressRequest,
	UpdateBanUserRequest,
	UpdateUsernameRequest,
	UpdateUserRequest,
	UserAddress,
	UserAdminResponse,
	UserResponse
} from '../api/interface/user';
import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	HeadersDefaults,
	ResponseType,
} from 'axios';
import {
	CategoryResponse,
	CreateCategoryRequest,
	CreateProductRequest,
	ProductAdminResponse,
	ProductFeatureRequest,
	ProductResponse,
	ProductThumbnailVm,
	UpdateBanProductRequest,
	UpdateCategoryRequest,
	UpdateProductRequest
} from '@interfaces/product';
import { MediaVm } from '@interfaces/media';
import {
	CreateStoreRequest,
	GetMyStoreResponse,
	ProductStoreRequest,
	ProductStoreResponse,
	StoreAdminResponse,
	StoreResponse,
	UpdateStoreRequest
} from '@interfaces/store';
import { CreateRatingRequest, RatingResponse, UpdateRatingRequest } from '@interfaces/rating';
import {
	CartGetDetailResponse,
	CartItemRequest,
	CartResponse,
	DeleteCartItemRequest,
	UpdateQuantityRequest
} from '@interfaces/cart';
import { ProductListGetVm, ProductNameListVm } from '@interfaces/search';
import {
	CalculateShippingOrderRequest,
	CreateDeliveryRequest,
	DeliveryResponse,
	ListDeliveryRequest,
	UpateDeliveryRequest
} from '@interfaces/delivery';
import {
	AdminOrderDetailResponse,
	CancelOrderRequest,
	CountMyOrderResponse,
	CreateOrderRequest,
	CreateOrderResponse,
	GetMyOrderResponse,
	GetOrderByIdResponse,
	GetOrderDaysResponse,
	GetProductBestSellerResponse,
	GetTotalCommissionResponse,
	GetTotalOrderInMonthResponse,
	GetTotalOrderInYear,
	searchStoreOrderResponse,
	StatusBodyRequest,
	StoreOrderDetailResponse,
	UpdateOrderItemStatusByStoreResponse
} from '@interfaces/order';
import {
	ApplyVoucherReponse,
	ApplyVoucherRequest,
	CheckVoucherReponse,
	CheckingVoucherRequest,
	ListVoucherReponse,
	TotalAmountReponse,
	UpdateStatusVoucher,
	createVoucherRequest
} from '@interfaces/promotion';
import {
	CheckPaymentOrderResponse,
	PayByPaypalRequest,
	PaymentResponse,
	PayOrderRequest,
	TotalAmountRequest,
	validWithdrawPayPalRequest,
	withdrawPayPalRequest
} from '@interfaces/payment';
import {
	CommissionResponse,
	CreateCommissionRequest,
	UpdateCommissionRequest
} from '@interfaces/commission';
import { CampaignDetail, CreateCampaignRequest, GeneralCampaignAdminResponse, ListCampaignDetail, NewDeviceRequest, NewDeviceResponse, RecallCampaignRequest } from '@/api/interface/notification';
import { isMobile } from 'react-device-detect';

export type QueryParamsType = Record<string | number, unknown>;


export interface FullRequestParams
	extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseType;
	/** request body */
	body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
	extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
	securityWorker?: (
		securityData: SecurityDataType | null
	) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
	secure?: boolean;
	format?: ResponseType;
}

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
	public instance: AxiosInstance;
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
	private secure?: boolean;
	private format?: ResponseType;

	constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
		this.instance = axios.create({
			...axiosConfig,
			baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_BASE_VERSION}`,
		});
		this.secure = secure;
		this.format = format;
		this.securityWorker = securityWorker;
		this.instance.interceptors.request.use(
			(config) => {
				const accessToken = this.getLocalAccessToken();
				if (accessToken) {
					config.headers['Authorization'] = `Bearer ${accessToken}`;
					config.headers['Device-Type'] = isMobile ? '0' : '1';
					config.headers['Sid'] = localStorage.getItem('sid') || '';
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		this.instance.interceptors.response.use(
			(res) => {
				return res;
			},
			async (err) => {
				const originalRequest = err.config;
				if (err.response) {
					// Access Token was expired
					if (err.response.status === 401 && !originalRequest._retry) {
						originalRequest._retry = true;

						try {
							const user = JSON.parse(localStorage.getItem('REACT_STARTER_AUTH'));
							if (!user || !user.refreshToken)
								throw new Error('Không có refresh token');
							const response = await this.instance.post('/auth/refresh-token', {
								refreshToken: user.refreshToken,
							});
							if (response.data.accessToken) {
								localStorage.setItem('accessToken', response.data.accessToken);
								localStorage.setItem('REACT_STARTER_AUTH', JSON.stringify({
									accessToken: response.data.accessToken,
									isAuthenticated: true,
								}));

								if (response.headers['Sid']) {
									localStorage.setItem('Sid', response.headers['Sid']);
								}

								this.instance.defaults.headers.common[
									'Authorization'
								] = `Bearer ${response.data.accessToken}`;

								this.instance.defaults.headers.common[
									'Sid'
								] = response.headers['Sid'];

								originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
								return this.instance(originalRequest);
							}
						} catch (error) {
							// Xử lý lỗi
							console.log('Gửi lại request' + error);
						}
					}

					if (err.response.status === 403 && err.response.data) {
						return Promise.reject(err.response.data);
					}
				}

				return Promise.reject(err);
			}
		);
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};

	public request = async <T = unknown>({
		secure,
		path,
		type,
		query,
		format,
		body,
		...params
	}: FullRequestParams): Promise<AxiosResponse<T>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const responseFormat = format || this.format || undefined;

		if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
			body = this.createFormData(body as Record<string, unknown>);
		}

		if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
			body = JSON.stringify(body);
		}

		try {
			const response = await this.instance.request({
				...requestParams,
				headers: {
					...(requestParams.headers || {}),
					...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
				},
				params: query,
				responseType: responseFormat,
				data: body,
				url: path,
			});
			return response;
		} catch (error) {
			if (error.response) {
				return error.response;
			}
			throw error;
		}
	};

	protected getLocalAccessToken = () => {
		return localStorage.getItem('accessToken');
	};

	protected mergeRequestParams(
		params1: AxiosRequestConfig,
		params2?: AxiosRequestConfig
	): AxiosRequestConfig {
		const method = params1.method || (params2 && params2.method);

		return {
			...this.instance.defaults,
			...params1,
			...(params2 || {}),
			headers: {
				...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {}),
			},
		};
	}

	protected stringifyFormItem(formItem: unknown) {
		if (typeof formItem === 'object' && formItem !== null) {
			return JSON.stringify(formItem);
		} else {
			return `${formItem}`;
		}
	}

	protected createFormData(input: Record<string, unknown>): FormData {
		return Object.keys(input || {}).reduce((formData, key) => {
			const property = input[key];
			const propertyContent: unknown[] = property instanceof Array ? property : [property];

			for (const formItem of propertyContent) {
				const isFileType = formItem instanceof Blob || formItem instanceof File;
				formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
			}

			return formData;
		}, new FormData());
	}
}


export class Api<SecurityDataType> extends HttpClient<SecurityDataType> {
	auth = {
		/**
		 * No description
		 *
		 * @tags auth-controller
		 * @name CreateAuthenticationToken
		 * @request POST:/auth/login
		 */
		createAuthenticationToken: (data: LoginRequest) =>
			this.request<LoginResponse>({
				path: `/auth/login`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		/**
		 * No description
		 *
		 * @tags auth-controller
		 * @name RefreshAuthenticationToken
		 * @request POST:/auth/refresh-token
		 */
		refreshAuthenticationToken: (data: RefreshTokenInput) =>
			this.request<RefreshTokenResponse>({
				path: `/auth/refresh-token`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		resetPassword: (request: ResetPasswordRequest) =>
			this.request<void>({
				path: `/auth/reset-password`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		forgotPassword: (request: ForgotPasswordRequest) =>
			this.request<void>({
				path: `/auth/forgot-password`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		registerAccount: (request: RegisterAccountRequest) =>
			this.request<void>({
				path: `/auth/register`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		finishVerifyAccount: (request: FinishVerifyAccountRequest) =>
			this.request<void>({
				path: `/auth/finish-verify-account`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		verifyAccount: (request: VerifyAccountRequest) =>
			this.request<void>({
				path: `/auth/verify-account`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),
	};


	users = {

		addMyAddress: (data: CreateUserAddressRequest) =>
			this.request<UserAddress>({
				path: `/users/my-address`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		getMyAddress: (params: QueryParamsType) =>
			this.request<PagedResultResponse<UserAddress>>({
				path: `/users/my-address`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		countMyAddress: () =>
			this.request<number>({
				path: `/users/count-my-address`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getMyAddressById: (id: string) =>
			this.request<UserAddress>({
				path: `/users/my-address/${id}`,
				method: 'GET',
				type: ContentType.Json,

			}),

		updateMyAddress: (id: string, address: UserAddress) =>
			this.request<UserAddress>({
				path: `/users/my-address/${id}`,
				method: 'PUT',
				type: ContentType.Json,
				body: address

			}),

		deleteMyAddress: (id: string) =>
			this.request<UserAddress>({
				path: `/users/my-address/${id}`,
				method: 'DELETE',
				type: ContentType.Json,

			}),

		getMyProfile: () =>
			this.request<UserResponse>({
				path: `/users/my-profile`,
				method: 'GET',
				type: ContentType.Json,

			}),

		updateProfile: (request: UpdateUserRequest) =>
			this.request<UserResponse>({
				path: `/users/my-profile`,
				method: 'PUT',
				type: ContentType.Json,
				body: request
			}),

		updateUsername: (request: UpdateUsernameRequest) =>
			this.request<UserResponse>({
				path: `/users/profile/username`,
				method: 'PUT',
				type: ContentType.Json,
				body: request
			}),

		getAdminUser: (params: QueryParamsType) =>
			this.request<PagedResultResponse<UserAdminResponse>>({
				path: `/users/admin`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		updateBanUser: (request: UpdateBanUserRequest) =>
			this.request<void>({
				path: `/users/${request.id}/ban`,
				method: 'PATCH',
				type: ContentType.Json,
				body: request
			}),

		countAllUser: () =>
			this.request<number>({
				path: `/users/count`,
				method: 'GET',
				type: ContentType.Json,
			}),

	}
	category = {
		getCategories: (params: QueryParamsType) =>
			this.request<PagedResultResponse<CategoryResponse>>({
				path: `/categories/paginate`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getChildCategories: (parentId: string) =>
			this.request<CategoryResponse[]>({
				path: `/categories/children-categories/${parentId}`,
				method: 'GET',
				type: ContentType.Json,

			}),

		getCategory: (id: string) =>
			this.request<CategoryResponse>({
				path: `/categories/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		searchCategory: (params: QueryParamsType) =>
			this.request<CategoryResponse[]>({
				path: `/categories/search`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		addCategory: (data: CreateCategoryRequest) =>
			this.request<CategoryResponse>({
				path: `/categories`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		updateCategory: (category: UpdateCategoryRequest) =>
			this.request<CategoryResponse>({
				path: `/categories/${category.id}`,
				method: 'PUT',
				body: category,
				type: ContentType.Json,
			}),

		deleteCategory: (id: string) =>
			this.request<CategoryResponse>({
				path: `/categories/${id}`,
				method: 'DELETE',
				type: ContentType.Json,
			}),


	}
	media = {
		uploadFile: (data: {
			file: File
		}) =>
			this.request<MediaVm>({
				path: `/medias`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
			}),
	}
	product = {
		countAllProduct: () =>
			this.request<number>({
				path: `/products/count`,
				method: 'GET',
				type: ContentType.Json,
			}),

		addProduct: (data: CreateProductRequest) =>
			this.request<ProductResponse>({
				path: `/products`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),
		updateProduct: (data: UpdateProductRequest) =>
			this.request<ProductResponse>({
				path: `/products/${data.id}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
			}),

		getProductById: (id: string) =>
			this.request<ProductResponse>({
				path: `/products/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getFeatureProduct: (request: ProductFeatureRequest[]) =>
			this.request<ProductThumbnailVm[]>({
				path: `/products/list-featured`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		getAdminProduct: (params: QueryParamsType) =>
			this.request<PagedResultResponse<ProductAdminResponse>>({
				path: `/products/admin`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		updateBanProduct: (request: UpdateBanProductRequest) =>
			this.request<void>({
				path: `/products/${request.id}/ban`,
				method: 'PATCH',
				type: ContentType.Json,
				body: request
			}),
	}

	store = {
		countAllStore: () =>
			this.request<number>({
				path: `/stores/count`,
				method: 'GET',
				type: ContentType.Json,
			}),
		getMyStore: () =>
			this.request<GetMyStoreResponse>({
				path: `/stores/my`,
				method: 'GET',
				type: ContentType.Json,
			}),

		registerStore: (data: CreateStoreRequest) =>
			this.request<StoreResponse>({
				path: `/stores/register-store`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		getMyProductStore: (params: QueryParamsType) =>
			this.request<PagedResultResponse<ProductStoreResponse>>({
				path: `/stores/my-products`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getProductStore: (request: ProductStoreRequest) =>
			this.request<PagedResultResponse<ProductStoreResponse>>({
				path: `/stores/${request.id}/products`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...request.params
				}
			}),

		getMyProductBanStore: (params: QueryParamsType) =>
			this.request<PagedResultResponse<ProductStoreResponse>>({
				path: `/stores/my-products/ban`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		updateMyStore: (data: UpdateStoreRequest) =>
			this.request<StoreResponse>({
				path: `/stores/my`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
			}),

		getStoreById: (id: string) =>
			this.request<StoreResponse>({
				path: `/stores/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getAdminStore: (params: QueryParamsType) =>
			this.request<PagedResultResponse<StoreAdminResponse>>({
				path: `/stores/admin`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),
		updateBanStore: (request: UpdateBanProductRequest) =>
			this.request<void>({
				path: `/stores/${request.id}/ban`,
				method: 'PATCH',
				type: ContentType.Json,
				body: request
			}),
	}
	rating = {
		getDetailRating: (id: string) =>
			this.request<RatingResponse>({
				path: `/ratings/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),
		/**
		 *
		 * @param {string} productId
		 * @param {number} skip
		 * @param {number} size
		 * @param {string} orderBy
		 * @param {GetRatingFilterStarEnum} filterStar
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		getRatingProduct: (params: QueryParamsType) =>
			this.request<PagedResultResponse<RatingResponse>>({
				path: `/ratings/rating-product`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		/**
		 *
		 * @param {string} productId
		 * @param {number} skip
		 * @param {number} size
		 * @param {string} orderBy
		 * @param {GetRatingFilterStarEnum} filterStar
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		getRatingStore: (params: QueryParamsType) =>
			this.request<PagedResultResponse<RatingResponse>>({
				path: `/ratings/rating-store`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		/**
		 *
		 * @param {string} id
		 * @param {UpdateRatingRequest} updateRatingRequest
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		update: (id: string, updateRatingRequest: UpdateRatingRequest) =>
			this.request<RatingResponse>({
				path: `/ratings/${id}`,
				method: 'PUT',
				type: ContentType.Json,
				body: updateRatingRequest
			}),

		/**
		 *
		 * @param {string} id
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		remove: (id: string) =>
			this.request<RatingResponse>({
				path: `/ratings/${id}`,
				method: 'DELETE',
				type: ContentType.Json,
			}),

		/**
		 *
		 * @param {CreateRatingRequest} createRatingRequest
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		create: (createRatingRequest: CreateRatingRequest) =>
			this.request<RatingResponse>({
				path: `/ratings`,
				method: 'POST',
				type: ContentType.Json,
				body: createRatingRequest
			}),
	}
	cart = {
		getMyCart: (params: QueryParamsType) =>
			this.request<PagedResultResponse<CartGetDetailResponse>>({
				path: `/carts/my-cart`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		addToCart: (data: CartItemRequest) =>
			this.request<CartResponse>({
				path: `/carts/add-to-cart`,
				method: 'POST',
				type: ContentType.Json,
				body: data
			}),

		updateQuantity: (request: UpdateQuantityRequest) =>
			this.request<VoidFunction>({
				path: `/carts/${request.id}/quantity`,
				method: 'PUT',
				type: ContentType.Json,
				body: request
			}),

		deleteCartItem: (request: DeleteCartItemRequest) =>
			this.request<VoidFunction>({
				path: `/carts/multi-delete `,
				method: 'DELETE',
				type: ContentType.Json,
				body: request
			}),
		getMultiCart: (params: QueryParamsType) =>
			this.request<CartGetDetailResponse[]>({
				path: `/carts/multi-cart`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),
	}
	search = {

		searchProduct: (params: QueryParamsType) =>
			this.request<ProductListGetVm>({
				path: `/${import.meta.env.VITE_SEARCH === 'true' ? 'search' : 'products'}/catalog-search`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			})
		,

		autoComplete: (params: QueryParamsType) =>
			this.request<ProductNameListVm>({
				path: `/${import.meta.env.VITE_SEARCH === 'true' ? 'search' : 'products'}/search_suggest`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			})

	}
	delivery = {
		getListDelivery: (request: ListDeliveryRequest) =>
			this.request<[]>({
				path: `/delivery/shipping/anonymous`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		createDelivery: (request: CreateDeliveryRequest) =>
			this.request<{ id: string }>({
				path: `/delivery/admin`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		upateDelivery: (request: UpateDeliveryRequest) =>
			this.request<void>({
				path: `/delivery/admin/${request.id}`,
				method: 'PATCH',
				type: ContentType.Json,
				body: request
			}),

		upateStatusDelivery: (request: { id: string, status: boolean }) =>
			this.request<void>({
				path: `/delivery/admin/${request.id}/status`,
				method: 'PATCH',
				type: ContentType.Json,
				body: { status: request.status }
			}),

		calculateShippingOrder: (request: CalculateShippingOrderRequest) =>
			this.request<unknown>({
				path: `/delivery/shipping/order`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		getAdminListDelivery: () =>
			this.request<DeliveryResponse[]>({
				path: `/delivery/admin`,
				method: 'GET',
				type: ContentType.Json,
			}),
	}
	order = {

		createOrder: (request: CreateOrderRequest) =>
			this.request<CreateOrderResponse>({
				path: `/orders/user`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		createOrderV2: (request: CreateOrderV2Request) =>
			this.request<CreateOrderResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/user`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		getMyOrder: (query: Record<string, string>) => {
			const queryParams = new URLSearchParams(query).toString();
			return this.request<GetMyOrderResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/user?${queryParams}`,
				method: 'GET',
				type: ContentType.Json,

			})
		},

		cancelOrder: (request: CancelOrderRequest) =>
			this.request<unknown>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/user/cancel`,
				method: 'PATCH',
				type: ContentType.Json,
				body: request
			}),

		getOrderById: (id: string) =>
			this.request<GetOrderByIdResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/user/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		countMyOrder: () =>
			this.request<CountMyOrderResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/user/total/count`,
				method: 'GET',
				type: ContentType.Json,
			}),

		searchStoreOrder: (params: Record<string, string>) => {
			const queryParams = new URLSearchParams(params).toString();
			return this.request<searchStoreOrderResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/store?${queryParams}`,
				method: 'GET',
				type: ContentType.Json,
			})
		},

		updateOrderItemStatusByStore:
			(request: StatusBodyRequest) => this.request<UpdateOrderItemStatusByStoreResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/store/${request.id}/items`,
				method: 'PATCH',
				type: ContentType.Json,
				body: request.body
			}),

		getStoreOrderDetail: (id: string) => this.request<StoreOrderDetailResponse>({
			baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
			path: `/store/${id}`,
			method: 'GET',
			type: ContentType.Json,
		}),

		cancelOrderItem: (request: StatusBodyRequest) => this.request<UpdateOrderItemStatusByStoreResponse>({
			baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
			path: `/store/${request.id}/items`,
			method: 'DELETE',
			type: ContentType.Json,
			body: request.body
		}),

		getTotalOrderInMonth:
			(params: QueryParamsType) => this.request<GetTotalOrderInMonthResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/store/total-order/month`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getTotalOrderInYear:
			(params: QueryParamsType) => this.request<GetTotalOrderInYear>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/store/total-order/year`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getTotalCommission:
			(params: QueryParamsType) => this.request<GetTotalCommissionResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/store/total-commission`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getProductBestSeller:
			(params: QueryParamsType) => this.request<GetProductBestSellerResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/store/list-of-product`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		searchOrderAdmin: (params: Record<string, string>) => {
			const queryParams = new URLSearchParams(params).toString();
			return this.request<searchStoreOrderResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/admin?${queryParams}`,
				method: 'GET',
				type: ContentType.Json,
			})
		},

		searchOrderDelivery: (params: Record<string, string>) => {
			const queryParams = new URLSearchParams(params).toString();
			return this.request<searchStoreOrderResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/delivery?${queryParams}`,
				method: 'GET',
				type: ContentType.Json,
			})
		},

		updateStatusOrderByDelivery: (request: UpdateOrderByDeliveryRequest) => {
			return this.request<searchStoreOrderResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/delivery/${request.id}`,
				method: 'PATCH',
				type: ContentType.Json,
				body: {
					status: request.status
				}
			})
		},

		getAdminOrderDetail: (id: string) => this.request<AdminOrderDetailResponse>({
			baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
			path: `/admin/${id}`,
			method: 'GET',
			type: ContentType.Json,
		}),

		getTotalOrderInMonthAdmin:
			(params: QueryParamsType) => this.request<GetTotalOrderInMonthResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/admin/total-order/month`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getTotalOrderInYearAdmin:
			(params: QueryParamsType) => this.request<GetTotalOrderInYear>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/admin/total-order/year`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getTotalCommissionAdmin:
			(params: QueryParamsType) => this.request<GetTotalCommissionAdminResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/admin/total-commission`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getProductBestSellerAdmin:
			(params: QueryParamsType) => this.request<GetProductBestSellerResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/admin/list-of-product`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getOrderDaysAdmin:
			(params: QueryParamsType) => this.request<GetOrderDaysResponse>({
				baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
				path: `/statistic/admin/total-order/day`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		countAllOrder: () => this.request<CountAllOrderResponse>({
			baseURL: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_ORDER_VERSION}/orders`,
			path: `/admin/total/count`,
			method: 'GET',
			type: ContentType.Json,
		}),
	}
	promotion = {
		applyVoucher: (request: ApplyVoucherRequest) =>
			this.request<ApplyVoucherReponse>({
				path: `/vouchers/apply`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		createVoucher: (request: createVoucherRequest) =>
			this.request<unknown>({
				path: `/vouchers/admin`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		getById: (id: string) =>
			this.request<unknown>({
				path: `/vouchers/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getByCode: (code: string) =>
			this.request<unknown>({
				path: `/vouchers/code/${code}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getAll: (params: Record<string, string>) => {
			const queryParams = new URLSearchParams(params).toString();
			return this.request<ListVoucherReponse>({
				path: `/vouchers/admin?${queryParams}`,
				method: 'GET',
				type: ContentType.Json,
			})
		},

		getVoucherUser: (params: Record<string, string>) => {
			const queryParams = new URLSearchParams(params).toString();
			return this.request<ListVoucherReponse>({
				path: `/vouchers/user/foryou?${queryParams}`,
				method: 'GET',
				type: ContentType.Json,
			})
		}
		,

		checkVoucher: (request: CheckingVoucherRequest) =>
			this.request<CheckVoucherReponse>({
				path: `/vouchers/checkout`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		updateStatusVoucher: (request: UpdateStatusVoucher) =>
			this.request<CheckVoucherReponse>({
				path: `/vouchers/admin/code/${request.code}`,
				method: 'PATCH',
				type: ContentType.Json,
				body: {
					status: request.status
				}
			}),

	}
	payment = {
		checkPaymentOrder: (id: string) =>
			this.request<CheckPaymentOrderResponse>({
				path: `/payment/payment-order/${id}`,
				method: 'POST',
				type: ContentType.Json,
			}),

		validPayment: (request: PayOrderRequest) =>
			this.request<void>({
				path: `/payment/pay`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		totalAmount: (request: TotalAmountRequest) =>
			this.request<TotalAmountReponse>({
				path: `/payment/total-amount`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		payByPaypal: (request: PayByPaypalRequest) =>
			this.request<void>({
				path: `/payment/capture-payments/paypal`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		checkOrderPaypal: (id: string) =>
			this.request<void>({
				path: `/payment/check-order-paypal/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		withdrawPayPal: (request: withdrawPayPalRequest) =>
			this.request<void>({
				path: `/payment/withdraw-paypal`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		validWithdrawPayPal: (request: validWithdrawPayPalRequest) =>
			this.request<void>({
				path: `/payment/valid-withdraw-paypal`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		getPaginatePayment: (params: QueryParamsType) =>
			this.request<PagedResultResponse<PaymentResponse>>({
				path: `/payment/paginate`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),
	}

	commission = {
		createCommission: (request: CreateCommissionRequest) =>
			this.request<CommissionResponse>({
				path: `/commissions`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		updateCommission: (request: UpdateCommissionRequest) =>
			this.request<CommissionResponse>({
				path: `/commissions/${request.id}`,
				method: 'PUT',
				type: ContentType.Json,
				body: request
			}),

		deleteCommission: (id: string) =>
			this.request<void>({
				path: `/commissions/${id}`,
				method: 'DELETE',
				type: ContentType.Json,
			}),

		getPaginateCommission: (params: QueryParamsType) =>
			this.request<PagedResultResponse<CommissionResponse>>({
				path: `/commissions/paginate`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),
	}

	notification = {
		registerNewDevice: (params: NewDeviceRequest) =>
			this.request<NewDeviceResponse>({
				baseURL: `http://127.0.0.1:5050/api/v1`,
				path: `/notifications/user/register-device`,
				method: 'POST',
				type: ContentType.Json,
				body: {
					...params
				}
			}),

		createCampaign: (body: CreateCampaignRequest) =>
			this.request<GeneralCampaignAdminResponse>({
				baseURL: `http://127.0.0.1:5050/api/v1`,
				path: `/notifications/admin/notify-campaign`,
				method: 'POST',
				type: ContentType.Json,
				body
			}),

		recallCampaign: (body: RecallCampaignRequest) =>
			this.request<GeneralCampaignAdminResponse>({
				baseURL: `http://127.0.0.1:5050/api/v1`,
				path: `/notifications/admin/notify-campaign`,
				method: 'DELETE',
				type: ContentType.Json,
				body
			}),

		getCampaignAdmin: (params: QueryParamsType) =>
			this.request<GeneralCampaignAdminResponse<ListCampaignDetail>>({
				baseURL: `http://127.0.0.1:5050/api/v1`,
				path: `/notifications/admin/notify-campaign`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getNotificationCount: () =>
			this.request<NewDeviceResponse>({
				baseURL: `http://127.0.0.1:5050/api/v1`,
				path: `/notifications/user/total/unread`,
				method: 'GET',
				type: ContentType.Json
			}),

		markAllRead: () =>
			this.request<GeneralCampaignAdminResponse>({
				baseURL: `http://127.0.0.1:5050/api/v1`,
				path: `/notifications/user/markAsRead`,
				method: 'PATCH',
				type: ContentType.Json
			}),

		getNotifications: (params: QueryParamsType) =>
			this.request<GeneralCampaignAdminResponse<ListCampaignDetail>>({
				baseURL: `http://127.0.0.1:5050/api/v1`,
				path: `/notifications/user`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getNotificationDetail: (id: string) =>
			this.request<GeneralCampaignAdminResponse<CampaignDetail>>({
				baseURL: `http://127.0.0.1:5050/api/v1`,
				path: `/notifications/user/${id}`,
				method: 'GET',
				type: ContentType.Json
			}),
	}
}

/**
 * @export
 */
export const GetRatingFilterStarEnum = {
	All: 'ALL',
	One: 'ONE',
	Two: 'TWO',
	Three: 'THREE',
	Four: 'FOUR',
	Five: 'FIVE'
} as const;
export type GetRatingFilterStarEnum = typeof GetRatingFilterStarEnum[keyof typeof GetRatingFilterStarEnum];
