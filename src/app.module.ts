import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AnnotationsModule } from "./annotations/annotations.module";
import { FriendshipModule } from "./friendship/friendship.module";
import { CategoryModule } from "./category/category.module";

@Module({
  imports: [AuthModule, AnnotationsModule, FriendshipModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
