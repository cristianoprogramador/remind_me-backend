import { Module } from "@nestjs/common";
import { NotificationController } from "./notifications.controller";
import { NotificationService } from "./notifications.service";
import { MailService } from "src/mail/mail.service";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, MailService],
})
export class NotificationsModule {}
