import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { type Product } from '../data/products';
import { FadeUp } from './FadeUp';
import { useCart } from '../context/CartContext';

interface HomeFeaturedProductsProps {
  products: Product[];
}

export const HomeFeaturedProducts: React.FC<HomeFeaturedProductsProps> = ({
  products,
}) => {
  const { addToCart } = useCart();
  return (
    <FadeUp className="py-20 border-y border-[#1F2937]/40 bg-[#0B0F14]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Featured Products
            </h2>
            <p className="text-slate-400">Top picks to get you started.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden flex flex-col group hover:border-[#A3E635]/50 transition-colors"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#0B0F14]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white text-lg">
                    {product.name}
                  </h3>
                  <span className="text-[#A3E635] font-semibold">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto w-full py-3 text-sm font-semibold text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] rounded-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </FadeUp>
  );
};
