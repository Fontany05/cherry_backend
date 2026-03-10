export const getPopulatedCart = async (query, CartModel) => {
  return await CartModel.findOne(query)
    .populate({
      path: 'items.productId',
      select: 'name image price brand stock'
    });
};