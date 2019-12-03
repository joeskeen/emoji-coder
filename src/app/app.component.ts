import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Emoji from 'emoji.json';
import { FormControl } from '@angular/forms';
import { EmojiKeyboardComponent } from './emoji-keyboard/emoji-keyboard.component';
import { StorageMap } from '@ngx-pwa/local-storage';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  static readonly DEFAULT_CODE = '🏁🍇\n  \n🍉\n';
  code = new FormControl(AppComponent.DEFAULT_CODE);
  insertionIndex = 7;

  @ViewChild('codeElement', { static: true })
  codeElement: ElementRef<HTMLTextAreaElement>;

  @ViewChild('keyboard', { static: true, read: EmojiKeyboardComponent })
  keyboard: EmojiKeyboardComponent;

  constructor(private storage: StorageMap) {}

  ngOnInit() {
    forkJoin(
      this.storage.get('code', { type: 'string' }),
      this.storage.get('recent', {
        type: 'array',
        items: {
          type: 'string'
        }
      })
    ).subscribe(([code, recent]) => {
      if (code) {
        this.code.patchValue(code);
        this.codeElement.nativeElement.setSelectionRange(0, 0);
      }
      if (recent) {
        this.keyboard.setRecent(recent);
      }
    });
    this.code.valueChanges.subscribe(v => {
      this.storage.set('code', v, { type: 'string' }).subscribe();
    });
  }

  ngAfterViewInit() {
    this.codeElement.nativeElement.setSelectionRange(
      this.insertionIndex,
      this.insertionIndex
    );
    this.codeElement.nativeElement.focus();
  }

  emojiSelected(emoji: Emoji.EmojiDefinition) {
    const currentValue: string = this.code.value;
    this.code.patchValue(
      currentValue.substring(0, this.insertionIndex) +
        emoji.char +
        currentValue.substring(this.insertionIndex)
    );
    this.insertionIndex = this.insertionIndex + emoji.char.length;
    this.codeElement.nativeElement.setSelectionRange(
      this.insertionIndex,
      this.insertionIndex
    );
    this.codeElement.nativeElement.focus();
    this.storage
      .set(
        'recent',
        this.keyboard.recentEmojis.map(e => e.char),
        {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      )
      .subscribe();
  }

  onKeyUp(event: KeyboardEvent) {
    this.insertionIndex = this.codeElement.nativeElement.selectionStart;
    if (event.code === 'Space' && event.ctrlKey) {
      this.insertionIndex = this.codeElement.nativeElement.selectionStart;
      this.keyboard.focus();
    }
  }

  onMouseUp(event: MouseEvent) {
    this.insertionIndex = this.codeElement.nativeElement.selectionStart;
  }
}
