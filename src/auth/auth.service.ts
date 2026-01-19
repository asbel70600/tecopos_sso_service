import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import type { AuthServicePort } from "./domain/auth.port.js";
import type {
    RegisterUserRequest,
    RegisterUserResponse,
} from "./domain/register_user.js";
import type { LoginRequest, LoginResponse } from "./domain/login.js";
import type { GetPublicKeyResponse } from "./domain/public_key.js";
import { PersistencePrismaAdapter } from "../persistance/persistance.prisma.adapter.js";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as fs from "node:fs";

@Injectable()
export class AuthService implements AuthServicePort {
    private privateKey: string;
    private publicKey: string;

    constructor(private readonly persistence: PersistencePrismaAdapter) {
        // Load RSA keys
        this.privateKey = fs.readFileSync("keys/private.key", "utf8");
        console.log(`Loaded private key: ${this.privateKey}`);
        this.publicKey = fs.readFileSync("keys/public.key", "utf8");
        console.log(`Loaded public key: ${this.privateKey}`);
    }

    async register(
        request: RegisterUserRequest,
    ): Promise<RegisterUserResponse> {
        // Validate email
        if (!this.isValidEmail(request.email)) {
            throw new BadRequestException("Invalid email format");
        }

        // Validate password
        if (request.password.length < 8) {
            throw new BadRequestException(
                "Password must be at least 8 characters",
            );
        }

        // Check if user already exists
        const existingUser = await this.persistence.findUserByEmail(
            request.email,
        );
        if (existingUser) {
            throw new UnauthorizedException("User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(request.password, 10);

        // Create user
        const user = await this.persistence.createUser({
            email: request.email,
            password: hashedPassword,
        });

        return {
            id: user.id,
            email: user.email,
        };
    }

    async login(request: LoginRequest): Promise<LoginResponse> {
        // Find user
        const user = await this.persistence.findUserByEmail(request.email);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            request.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Generate JWT
        const payload = {
            sub: user.id,
            email: user.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        };

        const token = jwt.sign(payload, this.privateKey, {
            algorithm: "RS256",
        });

        return {
            access_token: token,
            token_type: "Bearer",
            expires_in: 3600,
        };
    }

    async getPublicKey(): Promise<GetPublicKeyResponse> {
        return {
            publicKey: this.publicKey,
        };
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
