import { notFound } from '../lib/http.js'
import { asyncHandler } from '../middleware/async-handler.js'
import { menuRepository } from '../repositories/menu-repository.js'

export const menuController = {
  listPublicMenu: asyncHandler(async (req, res) => {
    const hotelId = req.tenant?.hotelId

    if (!hotelId) {
      throw notFound('Tenant is required to load a menu')
    }

    const categories = await menuRepository.listCategoriesWithItems(hotelId)

    res.status(200).json({ categories })
  }),
}
