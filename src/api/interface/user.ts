/**
 * 
 * @export
 * @interface CreateRoleRequest
 */
export interface CreateRoleRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof CreateRoleRequest
	 */
	'name'?: string;
}
/**
 * 
 * @export
 * @interface CreateUserAddressRequest
 */
export interface CreateUserAddressRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserAddressRequest
	 */
	'contactName': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserAddressRequest
	 */
	'phone': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserAddressRequest
	 */
	'detailAddress': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserAddressRequest
	 */
	'zipCode'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof CreateUserAddressRequest
	 */
	'cityOrProvinceId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserAddressRequest
	 */
	'cityOrProvinceName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof CreateUserAddressRequest
	 */
	'districtId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserAddressRequest
	 */
	'districtName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof CreateUserAddressRequest
	 */
	'wardId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserAddressRequest
	 */
	'wardName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof CreateUserAddressRequest
	 */
	'countryId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserAddressRequest
	 */
	'countryName'?: string;
}
/**
 * 
 * @export
 * @interface CreateUserRequest
 */
export interface CreateUserRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserRequest
	 */
	'hashedPassword': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserRequest
	 */
	'avatar'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserRequest
	 */
	'role'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserRequest
	 */
	'firstName': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserRequest
	 */
	'lastName': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserRequest
	 */
	'phoneNumber'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateUserRequest
	 */
	'email': string;
}
/**
 * 
 * @export
 * @interface RegisterRequest
 */
export interface RegisterRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof RegisterRequest
	 */
	'phoneNumber'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof RegisterRequest
	 */
	'email': string;
	/**
	 * 
	 * @type {string}
	 * @memberof RegisterRequest
	 */
	'hashedPassword': string;
	/**
	 * 
	 * @type {string}
	 * @memberof RegisterRequest
	 */
	'avatar'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof RegisterRequest
	 */
	'firstName': string;
	/**
	 * 
	 * @type {string}
	 * @memberof RegisterRequest
	 */
	'lastName': string;
}
/**
 * 
 * @export
 * @interface RoleResponse
 */
export interface RoleResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof RoleResponse
	 */
	'id'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof RoleResponse
	 */
	'name'?: string;
}
/**
 * 
 * @export
 * @interface UpdateUserAddressRequest
 */
export interface UpdateUserAddressRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'contactName': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'phone': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'detailAddress': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'city'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'zipCode'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof UpdateUserAddressRequest
	 */
	'districtId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'districtName'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'stateOrProvinceId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'stateOrProvinceName'?: string;
	'wardId'?: string;
	'wardName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof UpdateUserAddressRequest
	 */
	'countryId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateUserAddressRequest
	 */
	'countryName'?: string;
}

/**
 * 
 * @export
 * @interface UserAddress
 */
export interface UserAddress {
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'id'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'contactName': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'phone': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'detailAddress': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'zipCode'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof UserAddress
	 */
	'cityOrProvinceId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'cityOrProvinceName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof UserAddress
	 */
	'districtId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'districtName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof UserAddress
	 */
	'wardId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'wardName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof UserAddress
	 */
	'countryId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof UserAddress
	 */
	'countryName'?: string;

	/**
	* 
	* @type {string}
	* @memberof UserAddress
	*/
	'detail'?: string;
}
/**
 * 
 * @export
 * @interface UserResponse
 */
export interface UserResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof UserResponse
	 */
	'id'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserResponse
	 */
	'firstName'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserResponse
	 */
	'lastName'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserResponse
	 */
	'displayName'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserResponse
	 */
	'phoneNumber'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserResponse
	 */
	'email'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserResponse
	 */
	'avatar'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UserResponse
	 */
	'role'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof UserResponse
	 */
	'eWallet': number;
	/**
	 * 
	 * @type {number}
	 * @memberof UserResponse
	 */
	'point'?: number;

	'addresses'?: UserAddress[];
	'username'?: string;
	'isChangeUsername'?: boolean;
	'gender'?: string;
	'birthday'?: Date;
}

export interface District {
	name: string,
	type: string,
	slug: string,
	name_with_type: string,
	path: string,
	path_with_type: string,
	code: number,
	parent_code: number,
}

export interface Ward {
	name: string,
	type: string,
	slug: string,
	name_with_type: string,
	path: string,
	path_with_type: string,
	code: number,
	parent_code: number,
}

export interface Province {
	name: string,
	type: string,
	slug: string,
	name_with_type: string,
	code: number,
}


export interface UpdateUsernameRequest {
	username: string;
}

/**
 * 
 * @export
 * @interface UpdateUserRequest
 */
export interface UpdateUserRequest {
	phoneNumber: string
	firstName: string
	lastName: string
	displayName: string
	avatar: string
	gender: string
	birthday: Date,
	avatarFile: File
}


export interface UserAdminResponse {
	id: string;
	displayName: string;
	phoneNumber: string;
	email: string;
	avatar: string;
	role: string;
	eWallet: number;
	point: number;
	username: string;
	isBanned: boolean;
	reasonBan: string;
	gender: string;
	birthday: Date;
}

export interface UpdateBanUserRequest {
	id: string;
	isBanned: boolean;
	reason: string;
}
