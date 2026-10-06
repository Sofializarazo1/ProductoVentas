import { GraphQLError } from 'graphql';
import { Product } from '../models/Product.js';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const resolvers = {
  Product: {
    id: (product) => product._id.toString(),
  },
  Query: {
    products: async (_, { filter = {} }) => {
      const conditions = {};

      if (filter.name) {
        conditions.name = { $regex: escapeRegExp(filter.name), $options: 'i' };
      }
      if (filter.category) {
        conditions.category = {
          $regex: `^${escapeRegExp(filter.category)}$`,
          $options: 'i',
        };
      }
      if (filter.minPrice != null || filter.maxPrice != null) {
        conditions.price = {};
        if (filter.minPrice != null) conditions.price.$gte = filter.minPrice;
        if (filter.maxPrice != null) conditions.price.$lte = filter.maxPrice;
      }
      if (filter.inStock === true) conditions.stock = { $gt: 0 };
      if (filter.inStock === false) conditions.stock = 0;

      return Product.find(conditions).sort({ name: 1 }).lean();
    },
    product: async (_, { id }) => Product.findById(id).lean(),
  },
  Mutation: {
    updateProduct: async (_, { id, input }) => {
      if (Object.keys(input).length === 0) {
        throw new GraphQLError('Indica al menos un campo para actualizar.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      try {
        return await Product.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        }).lean();
      } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
          throw new GraphQLError('El identificador o los datos del producto no son válidos.', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        throw error;
      }
    },
  },
};