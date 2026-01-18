import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import type { AuthService } from "./auth.service";
import type {
    RegisterUserRequest,
    RegisterUserResponse,
} from "./domain/register_user";
import type { LoginRequest, LoginResponse } from "./domain/login";
import type {
    GetPublicKeyRequest,
    GetPublicKeyResponse,
} from "./domain/public_key";

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
