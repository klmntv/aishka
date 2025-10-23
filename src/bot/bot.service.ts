/** @format */

import { Injectable, Logger } from '@nestjs/common'
import TelegramBot from 'node-telegram-bot-api'
import { TokenService } from './services/token.service'
import { MessageHandlerService } from './services/message-handler.service'

@Injectable()
export class BotService {
	private readonly logger = new Logger(BotService.name)
	private bots: TelegramBot[] = []

	constructor(
		private tokenService: TokenService,
		private messageHandler: MessageHandlerService
	) {}

	async startBots(): Promise<void> {
		const tokens = this.tokenService.getAvailableTokens()

		if (tokens.length === 0) {
			this.logger.error('No bot tokens found')
			throw new Error('Please add at least one bot token')
		}

		this.logger.log(`Found ${tokens.length} bot tokens, starting bots...`)

		await this.initializeBots(tokens)

		this.logger.log(`All ${tokens.length} bots  are running`)
	}

	async stopBots(): Promise<void> {
		this.logger.log('Stopping all bots...')

		for (const bot of this.bots) {
			await bot.stopPolling()
		}

		this.bots = []
		this.logger.log('All bots stopped')
	}

	private async initializeBots(tokens: string[]): Promise<void> {
		for (let i = 0; i < tokens.length; i++) {
			const botNumber = i + 1
			const token = tokens[i]

			await this.initializeBot(token, botNumber)
		}
	}

	private async initializeBot(token: string, botNumber: number): Promise<void> {
		try {
			const bot = new TelegramBot(token, { polling: true })
			this.bots.push(bot)

			this.setupMessageListener(bot, botNumber)
			this.setupErrorListener(bot, botNumber)

			this.logger.log(`Bot ${botNumber} started successfully`)
		} catch (error) {
			this.logger.error(`Failed to start bot ${botNumber}:`, error.message)
			throw error
		}
	}

	private setupMessageListener(bot: TelegramBot, botNumber: number): void {
		bot.on('message', async (msg) => {
			await this.messageHandler.handle(bot, msg, botNumber)
		})
	}

	private setupErrorListener(bot: TelegramBot, botNumber: number): void {
		bot.on('polling_error', (error) => {
			this.logger.error(`Polling error for bot ${botNumber}:`, error.message)
		})
	}
}
