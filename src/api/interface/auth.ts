export interface RefreshTokenInput {
	refreshToken: string
}

export interface RefreshTokenResponse {
	refreshToken: string,
	accessToken: string,
	detail?: string
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
	accessToken: string,
	detail?: string
}

export interface LoginRequest {
	username: string,
	password: string
}
export interface ResetPasswordRequest {
	token: string;
	password: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface RegisterAccountRequest {
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	hashedPassword: string
	gender: string
	birthday: string
}
export interface FinishVerifyAccountRequest {
	token: string;
}

export interface VerifyAccountRequest {
	email: string;
}
