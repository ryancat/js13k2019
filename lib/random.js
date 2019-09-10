// See https://gist.github.com/blixt/f17b47c62508be59987b
const [
  /**
   * The seed must be an integer.
   */
  RANDOM_SEED,
  /**
   * Returns a pseudo-random value between 1 and 2^32 - 2.
   */
  RANDOM_NEXT,
  /**
   * Returns a pseudo-random floating point number in range [0, 1).
   */
  RANDOM_NEXT_FLOAT
] = [0, 1, 2]

/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
function getRandom(seed) {
  const random = [
    seed,
    () => random[RANDOM_SEED] = random[RANDOM_SEED] * 16807 % 2147483647,
    () => random[RANDOM_SEED] = (random[RANDOM_NEXT] - 1) / 2147483646
  ]

  if (random[RANDOM_SEED] <= 0) {
    random[RANDOM_SEED] += 2147483646
  }
  
  return random
}
