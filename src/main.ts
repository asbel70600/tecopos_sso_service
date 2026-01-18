import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport } from "@nestjs/microservices";
import { join } from "node:path";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: "sso",
            protoPath: join(__dirname, "../proto/sso.proto"),
            url: process.env["GRPC_URL"] || "0.0.0.0:50051",
        },
    });

    await app.listen();
    console.log(
        "SSO gRPC server is listening on",
        process.env["GRPC_URL"] || "0.0.0.0:50051",
    );
}
bootstrap();
