import { Module } from '@nestjs/common';
import { NotificationEvents } from './events.gateway';

@Module({
  providers: [NotificationEvents],
  exports: [NotificationEvents],
})
export class EventsModule {}
