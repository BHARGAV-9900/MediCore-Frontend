export interface User {
  id: number;
  publicId: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;

  roleId: number;
  role: string;

  isActive: boolean;

  createdAt: string;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
}