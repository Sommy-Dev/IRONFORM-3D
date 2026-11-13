export type PlanId = 'free-trial' | 'day-pass' | 'monthly' | 'annual';

export interface ClassItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  intensity: number; // 1-5 scale
  duration: string;
  capacity: string;
  coach: string;
  schedule: string;
}

export interface Trainer {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  image: string;
  credentials: string[];
  experienceYears: number;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  isPopular?: boolean;
  badge?: string;
  features: string[];
  ctaText: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  achievement: string;
  image: string;
  rating: number;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  phone: string;
  plan: PlanId;
  preferredTime?: string;
}
