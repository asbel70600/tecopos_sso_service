import type { LoginRequest, LoginResponse } from "./login";
import type { GetPublicKeyResponse } from "./public_key";
import type { RegisterUserRequest, RegisterUserResponse } from "./register_user";

export interface AuthServicePort {
    register(request: RegisterUserRequest): Promise<RegisterUserResponse>;
    login(request: LoginRequest): Promise<LoginResponse>;
    getPublicKey(): Promise<GetPublicKeyResponse>;
}
