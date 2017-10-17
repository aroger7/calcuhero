import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

@Injectable()
export class NumberService extends MessageService<string> {
}
