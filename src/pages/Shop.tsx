import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Filter, X } from 'lucide-react';
import { type Product, fetchProducts, formatNaira } from '../data/products';
import { FadeUp } from '../components/FadeUp';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600?text=Product';

type CategoryKey = string;

const CATEGORY_LABELS: Record<string, string> = {
  'dumbbells-kettlebells': 'Dumbbells & Kettlebells',
  'barbells-plates': 'Barbells & Plates',
  'benches-racks': 'Benches & Racks',
  cardio: 'Cardio Machines',
  'resistance-bands': 'Resistance & Bands',
  accessories: 'Accessories',
};

const CATEGORIES: CategoryKey[] = [
  'dumbbells-kettlebells',
  'barbells-plates',
  'benches-racks',
  'cardio',
  'resistance-bands',
  'accessories',
];

function ProductSkeleton() {
  return (
    <article className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[4/5] w-full bg-[#0B0F14]" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <div className="h-5 w-32 bg-[#1F2937] rounded" />
          <div className="h-5 w-16 bg-[#1F2937] rounded" />
        </div>
        <div className="h-4 w-24 bg-[#1F2937] rounded mt-4 mb-4" />
        <div className="mt-auto h-8 w-full bg-[#1F2937] rounded" />
      </div>
    </article>
  );
}

export const ShopPage: React.FC = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('q') ?? '',
  );
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(
    (searchParams.get('category') as CategoryKey) || null,
  );
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>(
    (searchParams.get('sort') as any) || 'featured',
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts(activeCategory ?? undefined);
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();
      const next = new URLSearchParams(searchParams);
      if (q) next.set('q', q);
      else next.delete('q');
      next.delete('category');
      next.delete('sort');
      setSearchParams(next);
      setActiveCategory(null);
      setSort('featured');
    },
    [searchQuery, searchParams, setSearchParams],
  );

  const handleCategory = useCallback(
    (cat: CategoryKey | null) => {
      const next = new URLSearchParams(searchParams);
      if (cat) {
        next.set('category', cat);
        next.delete('q');
      } else {
        next.delete('category');
      }
      next.delete('sort');
      setSearchParams(next);
      setActiveCategory(cat);
      setSort('featured');
    },
    [searchParams, setSearchParams],
  );

  const handleSort = useCallback(
    (value: 'featured' | 'price-asc' | 'price-desc') => {
      const next = new URLSearchParams(searchParams);
      next.set('sort', value);
      setSearchParams(next);
      setSort(value);
    },
    [searchParams, setSearchParams],
  );

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !activeCategory || product.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === 'price-asc') arr.sort((a, b) => a.price_ngn - b.price_ngn);
    if (sort === 'price-desc') arr.sort((a, b) => b.price_ngn - a.price_ngn);
    return arr;
  }, [filtered, sort]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <X className="w-10 h-10 mx-auto mb-3 text-slate-500" />
          <p className="text-lg text-white font-medium">
            Failed to load products
          </p>
          <p className="text-sm text-slate-400">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              window.location.reload();
            }}
            className="mt-4 px-5 py-3 rounded-lg bg-[#A3E635] text-[#0B0F14] font-semibold hover:bg-[#b2f746] transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 [@media(min-width:480px)]:grid-cols-2 [@media(min-width:768px)]:grid-cols-3 gap-6">
        {sorted.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <X className="w-10 h-10 mx-auto mb-3 text-slate-500" />
            <p className="text-lg text-white font-medium">No products found</p>
            <p className="text-sm text-slate-400">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          sorted.map((product) => (
            <article
              key={product.id}
              className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden flex flex-col group hover:border-[#A3E635]/50 transition-colors"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#0B0F14]">
                <img
                  src={product.image_url ?? PLACEHOLDER_IMAGE}
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
                    {formatNaira(product.price_ngn)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  {product.category}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-3 text-sm font-semibold text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] rounded-md transition-all"
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-[#0B0F14] min-h-[calc(100vh-16rem)]">
      <FadeUp className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Shop
              </h1>
              <p className="text-slate-400 mt-1">
                Browse our full range of gym equipment.
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex w-full lg:w-auto max-w-sm lg:max-w-md gap-2">
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-[#111827] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-lg bg-[#A3E635] text-[#0B0F14] font-semibold hover:bg-[#b2f746] transition-colors"
              >
                <Search className="w-4 h-4 mr-2" /> Search
              </button>
            </form>
          </div>
        </div>
      </FadeUp>

      <FadeUp className="mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Category chips row (scrollable on mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar md:overflow-visible md:pb-0 min-w-0">
              <button
                onClick={() => handleCategory(null)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === null
                    ? 'bg-[#A3E635] text-[#0B0F14]'
                    : 'bg-[#111827] border border-[#1F2937] text-white hover:bg-[#181C21]'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    handleCategory(activeCategory === cat ? null : cat)
                  }
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#A3E635] text-[#0B0F14]'
                      : 'bg-[#111827] border border-[#1F2937] text-white hover:bg-[#181C21]'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="shrink-0">
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value as any)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#111827] border border-[#1F2937] text-white focus:ring-2 focus:ring-[#A3E635] outline-none transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price low to high</option>
                <option value="price-desc">Price high to low</option>
              </select>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp className="mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </FadeUp>
    </section>
  );
};
