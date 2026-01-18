// import {
//     Injectable,
//     type OnModuleInit,
//     type OnModuleDestroy,
// } from "@nestjs/common";
//
// import "dotenv/config";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "generated/prisma/client";
//
// @Injectable()
// export class PrismaService
//     extends PrismaClient
//     implements OnModuleInit, OnModuleDestroy
// {
//     constructor() {
//         super({
//             datasources: {
//                 db: {
//                     url: process.env.DATABASE_URL,
//                 },
//             },
//         });
//     }
//
//     async onModuleInit() {
//         await this.$connect();
//     }
//
//     async onModuleDestroy() {
//         await this.$disconnect();
//     }
// }
