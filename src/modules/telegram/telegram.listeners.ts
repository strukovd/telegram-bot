import { ConfigService } from '@nestjs/config';
import { Command, Ctx, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Update()
export class TelegramListeners {

	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly configService: ConfigService
	) {
		const commands = [
			{ command: 'start', description: 'Инициировать запуск' },
			{ command: 'subscribe', description: 'Подписатся на рассылку' },
			{ command: 'unsubscribe', description: 'Отписатся от рассылки' },
		];
		this.bot.telegram.setMyCommands(commands);
	}


	@Start()
	async startCommand(ctx: Context): Promise<void> {
		await ctx.reply(`Привет 👋`);
	}


	@Command(`subscribe`)
	async onSubscribe(@Ctx() ctx: Context) {
		await ctx.reply('Вы подписались на рассылку форм 🤝');
	}

	@Command(`unsubscribe`)
	async onUnsubscribe(@Ctx() ctx: Context) {
		await ctx.reply('Вы отписались от рассылки форм');
	}


	// @On('text')
	// async onText(@Ctx() ctx: Context) {
	// 	const userId = ctx.message.from.id;
	// 	const { id: chatId, type: chatType } = ctx.chat;
	// 	console.log('User ID:', userId);
	// 	console.log('Chat ID:', chatId);
	// 	console.log('Chat type:', chatType);
	// 	await ctx.reply('🤝');
	// }
}
