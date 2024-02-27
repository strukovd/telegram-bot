import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramModule } from './modules/telegram/telegram.module';
import * as LocalSession from 'telegraf-session-local';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';

const tgSession = new LocalSession({ database: `tg-session.json` });

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				() => {
					return yaml.load(
						readFileSync(join(__dirname, `../storage/config.yaml`), 'utf8'),
					) as Record<string, any>;
				}
			]
		}),
		TelegrafModule.forRootAsync({
			imports: [ ConfigModule ],
			useFactory: (configService: ConfigService) => {
				return {
					token: configService.get<string>('telegram.token'),
					middlewares: [ tgSession.middleware() ]
				};
			},
			inject: [ ConfigService ]
		}),

		TelegramModule
	],
})
export class AppModule {}
