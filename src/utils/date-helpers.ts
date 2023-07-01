export const convertUnixToIso = (unixTimestamp: number) => {
  const secondsToMillisecondsFactor = 1000
  const timestampMillis = unixTimestamp * secondsToMillisecondsFactor

  const isoTimestamp = new Date(timestampMillis).toISOString()

  return isoTimestamp
}
