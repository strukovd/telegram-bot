import { Body, Controller, Post } from '@nestjs/common';
import { FeedbackFormDto } from './dto/feedback-form.dto';
import { TelegramService } from './telegram.service';
import { ConfigService } from '@nestjs/config';

@Controller({ path:`/`, version: `1` })
export class TelegramController {
	constructor(
		private readonly configService: ConfigService,
		private readonly telegramService: TelegramService
	) {}

	@Post(`/sendForm`)
	sendForm(@Body() body: FeedbackFormDto) {
		this.telegramService.sendForm(body);
	}
}
