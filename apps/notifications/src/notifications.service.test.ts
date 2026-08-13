import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { describe, beforeEach, it, jest, expect } from '@jest/globals';
import * as nodemailer from 'nodemailer';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let configServiceMock: { get: jest.Mock };

  beforeEach(async () => {
    configServiceMock = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a notification email', async () => {
    const email = 'test@example.com';
    const message = 'Hello, this is a test notification.';

    // Mock the sendMail method of nodemailer.Transporter
    const transporterMock: Partial<nodemailer.Transporter> = {
      sendMail: jest.fn().mockResolvedValue(undefined) as any,
    };

    // Replace the transporter property with the mock
    (service as any).transporter = transporterMock;

    await service.sendNotification(email, message);

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: configServiceMock.get('SMTP_USER'),
      to: email,
      subject: 'Notification',
      text: message,
    });
  });
});
