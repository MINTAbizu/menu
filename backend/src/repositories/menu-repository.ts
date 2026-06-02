import { MenuCategoryModel, MenuItemModel } from '../models/index.js'

export const menuRepository = {
  async listCategoriesWithItems(hotelId: string) {
    const categories = await MenuCategoryModel.find({ hotelId, isActive: true })
      .sort({ sortOrder: 1 })
      .lean({ virtuals: true })

    const items = await MenuItemModel.find({ hotelId, isAvailable: true })
      .sort({ name: 1 })
      .lean({ virtuals: true })

    return categories.map((category) => ({
      ...category,
      items: items.filter((item) => String(item.categoryId) === String(category._id)),
    }))
  },

  findItemsByIds(hotelId: string, itemIds: string[]) {
    return MenuItemModel.find({
      hotelId,
      _id: { $in: itemIds },
      isAvailable: true,
    }).lean({ virtuals: true })
  },
}
