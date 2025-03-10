export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  user_name: string;
  avatar_url?: string;
  userRole: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
};
