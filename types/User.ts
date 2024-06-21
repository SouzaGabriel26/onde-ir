export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  userName: string;
  userRole: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
};
