import { Injectable } from "@nestjs/common";
// import type { PrismaService } from "./prisma.service";
import type {
    CreateUserData,
    PersistencePort,
    User,
} from "src/auth/domain/persistance.port";
import { prisma } from "./prisma";

@Injectable()
export class PersistencePrismaAdapter implements PersistencePort {
    async createUser(data: CreateUserData): Promise<User> {
        return prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
            },
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}
