
export const formateInput = (e: KeyboardEvent, setInput: React.Dispatch<React.SetStateAction<string>>, isRunning: boolean) => {
  // Check if an input field is focused
  const inputFocused = localStorage.getItem('inputFocused') === 'true';
  const isInputElement = document.activeElement?.tagName === 'INPUT' ||
    document.activeElement?.tagName === 'TEXTAREA';

  if (inputFocused || isInputElement) {
    return; // Skip handling when input is focused
  }

  // Regular typing game logic
  if (e.key === 'Backspace') {
    setInput((prev: string) => prev.slice(0, -1));
  }
  else if (isRunning && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey && e.key !== 'Shift') {
    setInput((prev: string) => prev + e.key);
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

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}