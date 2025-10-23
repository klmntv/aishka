import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TokenService {
	constructor(private configService: ConfigService) {}

	getAvailableTokens(): string[] {
		const tokens: string[] = []
		let index = 1

		while (true) {
			const token = this.configService.get<string>(`BOT_TOKEN_${index}`)

			if (!token) {
				break
			}

			tokens.push(token)
			index++
		}

		return tokens
	}
}
