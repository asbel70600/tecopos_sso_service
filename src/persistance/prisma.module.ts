import { Module, Global } from "@nestjs/common";
// import { PrismaService } from "./prisma.service";
import { PersistencePrismaAdapter } from "./persistance.prisma.adapter";
import { prisma } from "./prisma";

@Global()
@Module({
    providers: [PersistencePrismaAdapter],
    exports: [PersistencePrismaAdapter],
})
export class PrismaModule {}
