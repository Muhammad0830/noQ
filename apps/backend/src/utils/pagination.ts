export const getPaginationParams = (req: any) => {
  const limit = Math.min(Number(req.query.limit) || 10, 30)
  const cursor = req.query.cursor || null

  return { limit, cursor }
}
