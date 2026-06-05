import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  colSpan?: number;
  rowSpan?: number;
  imageUrl?: string;
  galleryUrls?: string[];
  detailedDescription?: string;
  features?: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  category: string;
  imageUrl: string;
  galleryUrls?: string[];
  heightClass: string; // Tailwind aspect ratio or height class for masonry variation
  description: string;
}

export interface PricingItem {
  id: string;
  title: string;
  price: string;
  unit: string;
  features: string[];
  isPopular?: boolean;
}
