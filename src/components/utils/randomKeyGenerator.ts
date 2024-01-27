export default function randomKeyGenerator(): string {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
  const randomLength: number = Math.floor(Math.random() * 256) + 2;
  let i = 0;
  let randomKey = "";
  while (i < randomLength) {
    const randomNum: number = Math.floor(Math.random() * characters.length);
    randomKey += characters.substring(randomNum, randomNum + 1);
    i += 1;
  }
  return randomKey;
}
