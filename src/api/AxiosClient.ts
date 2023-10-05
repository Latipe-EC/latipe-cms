import { CreateUserAddressRequest, LoginRequest, LoginResponse, RefreshTokenInput, RefreshTokenResponse, UserAddressResponse } from 'api/Interface';
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    HeadersDefaults,
    ResponseType,
} from 'axios';

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
            baseURL: 'http://localhost:8181/api/v1/',
        });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
        this.instance.interceptors.request.use(
            (config) => {
                const accessToken = this.getLocalAccessToken();
                if (accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
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
                            const refreshToken = localStorage.getItem('refreshToken');
                            const response = await this.instance.post('/auth/refresh-token', {
                                refreshToken: refreshToken,
                            });
                            if (response.data.accessToken) {
                                localStorage.setItem('accessToken', response.data.accessToken);
                                this.instance.defaults.headers.common[
                                    'Authorization'
                                ] = `Bearer ${response.data.accessToken}`;
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
    protected getLocalAccessToken = () => {
        return localStorage.getItem('accessToken');
    };
    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
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
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }
    public request = async <T = unknown, _E = unknown>({
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

        return this.instance.request({
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
    };
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
            this.request<LoginResponse, unknown>({
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
        refreshAuthenticationToken: (data: RefreshTokenInput, params: RequestParams = {}) =>
            this.request<RefreshTokenResponse, unknown>({
                path: `/auth/refresh-token`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),
    };
    users = {
        /**
  * No description
  *
  * @tags auth-controller
  * @name AddMyAddress
  * @request POST:/auth/refresh-token
  */
        addMyAddress: (data: CreateUserAddressRequest, params: RequestParams = {}) =>
            this.request<UserAddressResponse, unknown>({
                path: `/users/my-address`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),
    }
}