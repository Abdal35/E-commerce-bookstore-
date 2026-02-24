export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  category_name?: string;
  stock: number;
  rating: number;
  format: string;
  is_featured: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  address: string;
  payment_method: string;
  created_at: string;
}
