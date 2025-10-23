import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BotService } from './bot/bot.service'

async function init() {
	const app = await NestFactory.createApplicationContext(AppModule, {
		logger: ['log', 'error', 'warn'],
	})

	const botService = app.get(BotService)

	try {
		await botService.startBots()
	} catch (error) {
		console.error('Failed to start bots:', error.message)
		await app.close()
		process.exit(1)
	}

	process.on('SIGINT', async () => {
		console.log('\nShutting down...')
		await botService.stopBots()
		await app.close()
		process.exit(0)
	})
}

init()
