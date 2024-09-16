import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Post,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GetUser } from "src/auth/get-user.decorator";
import { NotificationService } from "./notifications.service";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@ApiTags("Notifications")
@UseGuards(JwtAuthGuard)
@Controller("notifications")
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: "Obter configurações de notificação do usuário" })
  @ApiResponse({
    status: 200,
    description:
      "Configurações de notificação obtidas com sucesso ou não encontradas.",
  })
  async getNotificationSettings(@GetUser() user: { userId: string }) {
    try {
      const notificationSettings =
        await this.notificationService.getNotificationSettings(user.userId);

      if (!notificationSettings) {
        return {
          notificationsEmpty: true,
          emailNotify: false,
          phoneNotify: false,
          phoneNumber: "",
          weeklySummary: false,
        };
      }

      return notificationSettings;
    } catch (error) {
      console.error("Erro ao obter configurações de notificação:", error);
      throw new InternalServerErrorException(
        "Erro ao obter configurações de notificação."
      );
    }
  }

  @Put()
  @ApiOperation({
    summary: "Atualizar configurações de notificação do usuário",
  })
  @ApiResponse({
    status: 200,
    description: "Configurações de notificação atualizadas com sucesso.",
  })
  async updateNotificationSettings(
    @GetUser() user: { userId: string },
    @Body() updateNotificationDto: UpdateNotificationDto
  ) {
    return await this.notificationService.updateNotificationSettings(
      user.userId,
      updateNotificationDto
    );
  }

  @Post()
  @ApiOperation({
    summary: "Criar configurações de notificação para o usuário",
  })
  @ApiResponse({
    status: 201,
    description: "Configurações de notificação criadas com sucesso.",
  })
  @ApiResponse({
    status: 409,
    description: "Configurações de notificação já existem para este usuário.",
  })
  async createNotificationSettings(
    @GetUser() user: { userId: string },
    @Body() createNotificationDto: CreateNotificationDto
  ) {
    return await this.notificationService.createNotificationSettings(
      user.userId,
      createNotificationDto
    );
  }
}
