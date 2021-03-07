function getTime(): number {
  const seconds = Math.floor(new Date().getTime() / 1000);
  return seconds;
}

export default getTime;
