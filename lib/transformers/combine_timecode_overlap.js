const {
  last, update, assoc,
} = require('ramda');

function combineTimecodeOverlap(data) {
  if (!data.length) return data;

  const sortedTimes = [...new Set(data
      .map(cue => [cue.startMicro, cue.endMicro])
      .reduce((a, b) => a.concat(b), [])
      .sort((a, b) => a - b))];
  const indexMap = {};
  const combinedCues = [];

  for (let i = 0; i < sortedTimes.length - 1; i++) {
    const startMicro = sortedTimes[i];
    const endMicro = sortedTimes[i + 1];
    indexMap[startMicro] = i;
    combinedCues[i] = { startMicro, endMicro };
  }
  indexMap[sortedTimes[sortedTimes.length -1]] = sortedTimes.length -1

  data.forEach(cue => {
    const startIndex = indexMap[cue.startMicro];
    const endIndex = indexMap[cue.endMicro];
    combinedCues.slice(startIndex, endIndex).forEach(combined => {
      combined.text = combined.text && `${combined.text}\n${cue.text}` || cue.text
    });
  })

  return combinedCues
      .filter(cue => cue.text)
      .map((entry, id) => assoc('id', `${id + 1}`, entry));
}

module.exports = combineTimecodeOverlap;
