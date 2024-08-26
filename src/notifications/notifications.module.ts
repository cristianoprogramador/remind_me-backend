import { Module } from "@nestjs/common";
import { NotificationController } from "./notifications.controller";
import { NotificationService } from "./notifications.service";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationsModule {}
