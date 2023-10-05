export interface RefreshTokenInput {
    refreshToken: string
}

export interface RefreshTokenResponse {
    refreshToken: string
    accessToken: string
}

export interface LoginResponse {
    id: string,
    firstName: string,
    lastName: string,
    displayName: string,
    phone: string,
    email: string,
    bio: string,
    role: string,
    lastActiveAt: Date
    refreshToken: string
    accessToken: string
}

export interface LoginRequest {
    username: string,
    password: string
}


export interface CreateUserAddressRequest {
    contactName: string,
    phone: string,
    detailAddress: string,
    cityOrProvinceId: number,
    cityOrProvinceName: string,
    districtId: number,
    districtName: string,
    wardId: number,
    wardName: string
    countryId: number,
    countryName: string
}

export interface UserAddressResponse {
    id: string,
    contactName: string,
    phone: string,
    detailAddress: string,
    cityOrProvinceId: number,
    cityOrProvinceName: string,
    districtId: number,
    districtName: string,
    wardId: number,
    wardName: string
    countryId: number,
    countryName: string;
}

export interface District {
    name: string,
    type: string,
    slug: string,
    name_with_type: string,
    path: string,
    path_with_type: string,
    code: number,
    parent_code: number
}

export interface Ward {
    name: string,
    type: string,
    slug: string,
    name_with_type: string,
    path: string,
    path_with_type: string,
    code: number,
    parent_code: number
}

export interface Province {
    name: string,
    type: string,
    slug: string,
    name_with_type: string,
    code: number,
}