import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';
import { redirect } from 'next/navigation';

type UserProfileProps = {
  id: string;
};

export async function UserProfile({ id }: UserProfileProps) {
  const userDataSource = createUserDataSource();
  const { data } = await user.findById(userDataSource, { id });

  if (!data) {
    return redirect('/dashboard');
  }

  return <div>Perfil de um usuário do sistema.</div>;
}
