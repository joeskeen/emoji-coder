import {
  ElementRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import Emojis from 'emoji.json';
import { FormControl } from '@angular/forms';

interface EmojiCategoryMap {
  [category: string]: Emojis.EmojiDefinition[];
}
interface EmojiCategory {
  category: string;
  emojis: Emojis.EmojiDefinition[];
}

@Component({
  selector: 'app-emoji-keyboard',
  templateUrl: './emoji-keyboard.component.html',
  styleUrls: ['./emoji-keyboard.component.scss']
})
export class EmojiKeyboardComponent implements OnInit {
  emojis: Emojis.EmojiDefinition[] = Emojis;
  readonly maxReadonlyEmoji = 100;
  recentEmojis: Emojis.EmojiDefinition[] = [];
  categories: EmojiCategory[];
  emojiFilter = new FormControl('');
  filteredEmojis: Emojis.EmojiDefinition[] = [];

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef<HTMLInputElement>;

  @Output()
  readonly emojiSelect = new EventEmitter<Emojis.EmojiDefinition>();

  ngOnInit() {
    const map = Emojis.reduce((prev, curr) => {
      if (!prev[curr.category]) {
        prev[curr.category] = [];
      }
      prev[curr.category].push(curr);
      return prev;
    }, {} as EmojiCategoryMap);
    this.categories = Object.keys(map).map(k => ({
      category: k,
      emojis: map[k]
    }));
    this.emojiFilter.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: string) => {
        this.filteredEmojis = v
          ? Emojis.filter(e => e.name.toLowerCase().includes(v.toLowerCase()))
          : [];
      });
  }

  focus() {
    this.searchBox.nativeElement.focus();
  }

  emojiClicked(emoji: Emojis.EmojiDefinition) {
    if (!this.recentEmojis.includes(emoji)) {
      this.recentEmojis = [emoji, ...this.recentEmojis.slice(0, 99)];
    }
    this.emojiSelect.emit(emoji);
    this.emojiFilter.reset();
  }
}
