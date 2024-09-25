import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";
import { MailService } from "src/mail/mail.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, image } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException("Usuário já existe");
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash("default-oauth-password", 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profileImageUrl: image,
      },
    });
  }

  async generateJwtToken(user: User) {
    const payload = { username: user.email, sub: user.uuid, name: user.name };
    return this.jwtService.sign(payload);
  }

  async login(user: User) {
    const access_token = await this.generateJwtToken(user);
    return {
      access_token,
      user,
    };
  }

  async updateUserAndGenerateToken(userId: string, newName: string) {
    const user = await this.prisma.user.update({
      where: { uuid: userId },
      data: { name: newName },
    });

    return this.generateJwtToken(user);
  }

  async checkUser(email: string, image?: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && image && user.profileImageUrl !== image) {
      await this.prisma.user.update({
        where: { email },
        data: { profileImageUrl: image },
      });
    }

    return user;
  }

  async requestResetPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
    }

    const secret = this.configService.get<string>("RESET_PASSWORD_SECRET");
    const payload = { email: user.email, createdAt: new Date() };
    const resetToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: "1h",
    });

    const frontendUrl = this.configService.get<string>("FRONTEND_URL");
    const resetPasswordUrl = `${frontendUrl}/recover-password?token=${resetToken}`;

    await this.mailService.sendRecoverPasswordEmail(
      user.email,
      user.name,
      resetPasswordUrl
    );

    return {
      message: "E-mail de redefinição de senha enviado",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const secret = this.configService.get<string>("RESET_PASSWORD_SECRET");

    try {
      const payload = this.jwtService.verify(token, { secret });
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { email: user.email },
        data: { password: hashedPassword },
      });

      return {
        message: "Senha redefinida com sucesso",
      };
    } catch (error) {
      throw new HttpException(
        "Token inválido ou expirado",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
