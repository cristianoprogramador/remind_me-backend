import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      return null;
    }

    const token = authorization.split(" ")[1];
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const decodedToken = jwtService.decode(token);

    if (!decodedToken || typeof decodedToken === "string") {
      return null;
    }

    return { userId: decodedToken.sub, email: decodedToken.email };
  }
);
