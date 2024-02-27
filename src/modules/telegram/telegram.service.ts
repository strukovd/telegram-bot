import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { FeedbackFormDto } from './dto/feedback-form.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
	constructor(
		private readonly configService: ConfigService,
		@InjectBot() private readonly bot: Telegraf<Context>
	) {}


	public async sendForm(body: FeedbackFormDto): Promise<void> {
		const chats = this.configService.get<number[] | string[]>('telegram.chats');
		const formData = this.wrapMdCode( JSON.stringify(body, null, 2), `JSON` );
		const message = this.configService.get<string>('telegram.template').replace(`$__FORM_DATA`, formData);

		for (const chatIdOrName of chats) {
			await this.sendMessageToUser(chatIdOrName, message);
		}
	}


	private async sendMessageToUser(userIdOrName: number | string, message: string): Promise<void> {
		try {
			if( typeof userIdOrName === `string` && /^[^@]/.test(userIdOrName) ) {
				userIdOrName = `@${userIdOrName}`;
			}
			await this.bot.telegram.sendMessage(userIdOrName, message, { parse_mode: 'MarkdownV2' });
		} catch (error) {
			console.error('Ошибка при отправки сообщения:', error);
		}
	}


	private wrapMdCode(code: string, lang: string = ``) {
		return "```"+ lang +"\n"+ code +"\n```";
	}
}
