import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramListeners } from './telegram.listeners';
import { TelegramController } from './telegram.controller';

@Module({
	controllers: [ TelegramController ],
	providers: [ TelegramService, TelegramListeners ],
})
export class TelegramModule {}
