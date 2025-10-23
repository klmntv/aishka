import { Injectable, Logger } from '@nestjs/common'
import TelegramBot from 'node-telegram-bot-api'
import { TextReverserService } from './text-reverser.service'

@Injectable()
export class MessageHandlerService {
	private readonly logger = new Logger(MessageHandlerService.name)

	constructor(private textReverser: TextReverserService) {}

	async handle(
		bot: TelegramBot,
		msg: TelegramBot.Message,
		botNumber: number
	): Promise<void> {
		const chatId = msg.chat.id
		const text = msg.text

		if (!text) {
			return
		}

		this.logIncoming(botNumber, chatId, text)

		const reversedText = this.textReverser.reverse(text)

		try {
			await bot.sendMessage(chatId, reversedText)
			this.logOutgoing(botNumber, chatId, reversedText)
		} catch (error) {
			this.logError(botNumber, error.message)
		}
	}

	private logIncoming(botNumber: number, chatId: number, text: string): void {
		this.logger.log(
			`Bot ${botNumber} received message from ${chatId}: "${text}"`
		)
	}

	private logOutgoing(botNumber: number, chatId: number, text: string): void {
		this.logger.log(`Bot ${botNumber} sent response to ${chatId}: "${text}"`)
	}

	private logError(botNumber: number, message: string): void {
		this.logger.error(`Bot ${botNumber} failed to send message:`, message)
	}
}
