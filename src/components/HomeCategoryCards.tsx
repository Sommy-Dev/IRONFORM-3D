import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Bed,
  Activity,
  Shield,
  Zap,
} from 'lucide-react';
import { FadeUp } from './FadeUp';
import { slugify } from '../data/products';

type Category = {
  id: string;
  name: string;
  desc: string;
  Icon: React.ElementType;
};

const CATEGORIES: Category[] = [
  {
    id: 'dumbbells-kettlebells',
    name: 'Dumbbells & Kettlebells',
    desc: 'Free weights for strength and conditioning.',
    Icon: Dumbbell,
  },
  {
    id: 'barbells-plates',
    name: 'Barbells & Plates',
    desc: 'Olympic bars and bumper plates for heavy lifts.',
    Icon: Dumbbell,
  },
  {
    id: 'benches-racks',
    name: 'Benches & Racks',
    desc: 'Adjustable benches and power racks for every lift.',
    Icon: Bed,
  },
  {
    id: 'cardio',
    name: 'Cardio Machines',
    desc: 'Treadmills, rowers and bikes for endurance work.',
    Icon: Activity,
  },
  {
    id: 'resistance-bands',
    name: 'Resistance & Bands',
    desc: 'Mobility, rehab and accessory band training.',
    Icon: Zap,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    desc: 'Belts, wraps, chalk and gym essentials.',
    Icon: Shield,
  },
];

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const Icon = category.Icon;
  return (
    <FadeUp className="group cursor-pointer" delay={100}>
      <Link
        to={`/shop?category=${slugify(category.name)}`}
        className="block bg-[#111827] border border-[#1F2937] rounded-xl p-6 text-center hover:border-[#A3E635]/60 hover:bg-[#0B0F14]/50 transition-all"
      >
        <div className="w-12 h-12 rounded-lg bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#A3E635] group-hover:text-[#0B0F14] transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-white text-lg mb-2">{category.name}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {category.desc}
        </p>
      </Link>
    </FadeUp>
  );
};

export const HomeCategoryCards: React.FC = () => {
  return (
    <section className="py-20 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Shop by Category
          </h2>
          <p className="text-slate-400">
            Everything you need to equip your gym, from the floor up.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};
