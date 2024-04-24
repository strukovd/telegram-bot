import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true
	});

	const config = await app.get(ConfigService);
	const port = config.get<string>("http.port");

	app.enableVersioning({
		type: VersioningType.URI,
		prefix: 'api/v'
	});

	await app.listen(port, ()=>{
		console.log(`Приложение запущено на порту: ${port}`);
	});
}
bootstrap();
