import React, { useState } from 'react';
import { ShoppingCart, Dumbbell } from 'lucide-react';
import { type Product, formatNaira } from '../data/products';
import { FadeUp } from './FadeUp';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600?text=Product';

interface HomeFeaturedProductsProps {
  products: Product[];
}

export const HomeFeaturedProducts: React.FC<HomeFeaturedProductsProps> = ({
  products,
}) => {
  const { addToCart } = useCart();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
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
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#0B0F14]">
                {imageErrors.has(product.id) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#111827] text-slate-500">
                    <Dumbbell className="w-8 h-8 mb-2" />
                    <p className="text-xs text-center px-2">{product.name}</p>
                  </div>
                ) : (
                  <img
                    src={product.image_url ?? PLACEHOLDER_IMAGE}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                    onError={() =>
                      setImageErrors((prev) => new Set([...prev, product.id]))
                    }
                  />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white text-lg">
                    {product.name}
                  </h3>
                  <span className="text-[#A3E635] font-semibold">
                    {formatNaira(product.price_ngn)}
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
