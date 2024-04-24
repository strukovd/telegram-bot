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
		let { name, email, comment } = body;
		if( body.name ) {
			name = `<strong>Отправитель:</strong> ${name}`;
		}
		if( body.email ) {
			email = `<strong>Email:</strong> ${email}`;
		}
		if( body.comment ) {
			comment = `<strong>Комментарий:</strong> ${comment}`;
		}

		const message = [ `\n`, name, email, comment ].filter(item => item).join(`\n`);
		if(message !== "") {
			const messageWithTemplate = this.configService.get<string>('telegram.template')
				.replace(`$__FORM_DATA`, message);

			for (const chatIdOrName of chats) {
				await this.sendMessageToUser(chatIdOrName, messageWithTemplate);
			}
		}
	}


	private async sendMessageToUser(
		userIdOrName: number | string,
		message: string
	): Promise<void> {
		try {
			if( typeof userIdOrName === `string` && /^[^@]/.test(userIdOrName) ) {
				userIdOrName = `@${userIdOrName}`;
			}
			await this.bot.telegram.sendMessage(userIdOrName, message, { parse_mode: 'HTML' });
		} catch (error) {
			console.error('Ошибка при отправки сообщения:', error);
		}
	}


	private wrapMdCode(code: string, lang: string = ``) {
		return "```"+ lang +"\n"+ code +"\n```";
	}
}
