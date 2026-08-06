import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendNotification(email: string, message: string): Promise<void> {
  
    console.log(`Sending notification to user ${email}: ${message}`);
  }
}
