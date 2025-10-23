import { Module } from '@nestjs/common'
import { BotService } from './bot.service'
import { TokenService } from './services/token.service'
import { TextReverserService } from './services/text-reverser.service'
import { MessageHandlerService } from './services/message-handler.service'

@Module({
	providers: [
		BotService,
		TokenService,
		TextReverserService,
		MessageHandlerService,
	],
	exports: [BotService],
})
export class BotModule {}
