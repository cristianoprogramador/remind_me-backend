import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
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

    // Verifica se o usuário já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException("Usuário já existe");
    }

    // Criptografa a senha
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash("default-oauth-password", 10);

    // Cria o usuário
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profileImageUrl: image,
      },
    });
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
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
}
