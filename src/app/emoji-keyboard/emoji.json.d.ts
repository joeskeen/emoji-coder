declare module 'emoji.json' {
  namespace emojis {
    interface EmojiDefinition {
      codes: string;
      char: string;
      name: string;
      category: string;
    }
  }

  const emojis: emojis.EmojiDefinition[];
  export default emojis;
}
