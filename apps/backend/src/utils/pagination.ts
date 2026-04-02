export const getPaginationParams = (req: any) => {
  const limit = Math.min(Number(req.query.limit) || 10, 30)
  const cursor = req.query.cursor || null
  const shopCursor = req.query.shopCursor || null
  const serviceCursor = req.query.serviceCursor || null

  return { limit, cursor, shopCursor, serviceCursor }
}
