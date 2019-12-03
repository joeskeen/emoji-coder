import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit
} from '@angular/core';
import Emoji from 'emoji.json';
import { FormControl } from '@angular/forms';
import { EmojiKeyboardComponent } from './emoji-keyboard/emoji-keyboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  code = new FormControl('🏁🍇\n\n🍉');

  @ViewChild('codeElement', { static: true })
  codeElement: ElementRef<HTMLTextAreaElement>;

  @ViewChild('keyboard', { static: true, read: EmojiKeyboardComponent })
  keyboard: EmojiKeyboardComponent;

  ngAfterViewInit() {
    this.codeElement.nativeElement.focus();
  }

  emojiSelected(emoji: Emoji.EmojiDefinition) {
    this.code.patchValue(this.code.value + emoji.char);
    this.codeElement.nativeElement.focus();
  }

  onKeyDown(event: KeyboardEvent) {
    console.log(event);
    if (event.code === 'Space' && event.ctrlKey) {
      console.log('focus keyboard');
      this.keyboard.focus();
    }
  }
}
