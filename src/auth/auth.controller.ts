import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AuthService } from "./auth.service.js";
import type {
    RegisterUserRequest,
    RegisterUserResponse,
} from "./domain/register_user.js";
import type { LoginRequest, LoginResponse } from "./domain/login.js";
import type {
    GetPublicKeyRequest,
    GetPublicKeyResponse,
} from "./domain/public_key.js";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @GrpcMethod("AuthService", "Register")
    async register(
        request: RegisterUserRequest,
    ): Promise<RegisterUserResponse> {
        return this.authService.register(request);
    }

    @GrpcMethod("AuthService", "Login")
    async login(request: LoginRequest): Promise<LoginResponse> {
        return this.authService.login(request);
    }

    @GrpcMethod("AuthService", "GetPublicKey")
    async getPublicKey(
        request: GetPublicKeyRequest,
    ): Promise<GetPublicKeyResponse> {
        return this.authService.getPublicKey();
    }
}
