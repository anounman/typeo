
export const formateInput = (e: KeyboardEvent, setInput: React.Dispatch<React.SetStateAction<string>>, isRunning: boolean) => {
  if (isRunning && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey && e.key !== 'Shift') {
    setInput((prev: string) => prev + e.key);
  }
  if (e.key === 'Backspace') {
    setInput((prev: string) => prev.slice(0, -1));
  }
}

export const generateWords = (wordsCount: number) => {
  const nouns: Array<string> = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
  const verbs: Array<string> = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
  const adjectives: Array<string> = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
  const adverbs: Array<string> = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
  const preposition: Array<string> = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];


  const rand1 = Math.floor(Math.random() * (wordsCount));
  const rand3 = Math.floor(Math.random() * (wordsCount));
  const rand4 = Math.floor(Math.random() * (wordsCount));
  const rand2 = Math.floor(Math.random() * (wordsCount));
  const rand5 = Math.floor(Math.random() * (wordsCount));
  const rand6 = Math.floor(Math.random() * (wordsCount));
  const content: string = "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
  return content;



}