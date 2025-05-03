import { Types } from "mongoose";

export interface IAdmin {
  email: string;
  password: string;
  name: string;
  image: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
export interface ChangeEmailRequest {
  newEmail: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeImageRequest {
  newImage: string;
}
export interface ApiResponse<T = any> {
  error: boolean;
  message?: string;
  data?: T;
}
export interface LoginResponseData {
  token: string;
  email: string;
  name: string;
  image?: string;
}

export interface RegisterResponseData {
  email: string;
  name: string;
}

export interface IProduct {
  id?: string;
  slug: string;
  name: string;
  category: string[];
  price: number;
  stock: number;
  description: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddProductRequest {
  name: string;
  slug?: string;
  category: string[];
  price: number;
  stock: number;
  description: string;
  image?: string;
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  category?: string[];
  price?: number;
  stock?: number;
  description?: string;
  image?: string;
}

export interface ICategory {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
}

export interface AddCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  isActive: boolean;
}

export interface PaginationRequest {
  page: number;
  limit: number;
}

export interface PaginationResponse<T> {
  success: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}
