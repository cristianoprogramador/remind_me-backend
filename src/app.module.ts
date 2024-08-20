import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AnnotationsModule } from "./annotations/annotations.module";
import { FriendshipModule } from "./friendship/friendship.module";

@Module({
  imports: [AuthModule, AnnotationsModule, FriendshipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
