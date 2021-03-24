function getTime(): number {
  // get the current unix time in seconds NO MILLISECONDS
  return Math.floor(new Date().getTime() / 1000);
}

export default getTime;
