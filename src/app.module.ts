import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AnnotationsModule } from "./annotations/annotations.module";
import { FriendshipModule } from "./friendship/friendship.module";
import { CategoryModule } from "./category/category.module";
import { UserModule } from "./user/user.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    AuthModule,
    AnnotationsModule,
    FriendshipModule,
    CategoryModule,
    UserModule,
    NotificationsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
