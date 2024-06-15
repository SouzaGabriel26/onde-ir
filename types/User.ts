export type User = {
  id: string;
  email: string;
  name: string;
  userName: string;
  userRole: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
};
