/**
 * Calculates the cosine similarity between two vectors
 * @template {number[]} T
 * @param {T} vectorA
 * @param {[...T]} vectorB
 * @returns {number}
 */
export const cosineSimilarity = (vectorA, vectorB) => {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must be of same length")
  }

  const dotProduct = vectorA.reduce(
    (sum, a, index) => sum + a * vectorB[index],
    0
  )
  const vectorANorm = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0))
  const vectorBNorm = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0))

  return dotProduct / (vectorANorm * vectorBNorm)
}
