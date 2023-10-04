export interface RefreshTokenInput {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    refreshToken: string;
    accessToken: string;
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
    refreshToken: string;
    accessToken: string;
}

export interface LoginRequest {
    username: string,
    password: string;
}