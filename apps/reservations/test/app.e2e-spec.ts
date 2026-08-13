import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ReservationsModule } from './../src/reservations.module';
import { describe, beforeEach } from 'node:test';

describe('ReservationsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ReservationsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
