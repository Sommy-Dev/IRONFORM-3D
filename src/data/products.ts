export type Product = {
  id: string;
  name: string;
  price: number; // in Naira (₦)
  image: string;
  category: string;
};

export const WHATSAPP_NUMBER = '234XXXXXXXXXX'; // <-- change this to your number

export const PRODUCTS: Product[] = [
  {
    id: 'dumbbells',
    name: 'Dumbbells',
    price: 45000,
    category: 'Free Weights',
    image: 'https://placehold.co/600x600?text=Dumbbells',
  },
  {
    id: 'kettlebell',
    name: 'Kettlebell',
    price: 25000,
    category: 'Free Weights',
    image: 'https://placehold.co/600x600?text=Kettlebell',
  },
  {
    id: 'barbell',
    name: 'Barbell',
    price: 60000,
    category: 'Free Weights',
    image: 'https://placehold.co/600x600?text=Barbell',
  },
  {
    id: 'adjustable-bench',
    name: 'Adjustable Bench',
    price: 85000,
    category: 'Benches',
    image: 'https://placehold.co/600x600?text=Adjustable+Bench',
  },
  {
    id: 'resistance-bands',
    name: 'Resistance Bands',
    price: 15000,
    category: 'Accessories',
    image: 'https://placehold.co/600x600?text=Resistance+Bands',
  },
  {
    id: 'weight-plates',
    name: 'Weight Plates',
    price: 40000,
    category: 'Free Weights',
    image: 'https://placehold.co/600x600?text=Weight+Plates',
  },
];
