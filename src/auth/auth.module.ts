import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtStrategy } from "./jwt.strategy";
import { MailService } from "src/mail/mail.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy, PrismaService, MailService],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
