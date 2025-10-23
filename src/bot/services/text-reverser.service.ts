import { Injectable } from '@nestjs/common'

@Injectable()
export class TextReverserService {
	reverse(text: string): string {
		return text.split('').reverse().join('')
	}
}
