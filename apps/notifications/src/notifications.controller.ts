import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @MessagePattern('sendNotification')
  async sendNotification(
    @Payload() notifyEmailDto: NotifyEmailDto,
  ): Promise<void> {
    const { email, message } = notifyEmailDto;
    await this.notificationsService.sendNotification(email, message);
  }
}
