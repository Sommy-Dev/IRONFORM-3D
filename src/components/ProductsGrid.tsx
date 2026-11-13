import React from 'react';
import { type Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <article className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden flex flex-col group">
      <div className="aspect-[4/5] w-full overflow-hidden bg-[#0B0F14]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-white text-lg">{product.name}</h3>
          <span className="text-[#A3E635] font-semibold">
            ₦{product.price.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">{product.category}</p>
        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-3 text-sm font-semibold text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] rounded-md transition-all"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
};

interface ProductsGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  onAddToCart,
}) => {
  return (
    <section id="products" className="py-20 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
