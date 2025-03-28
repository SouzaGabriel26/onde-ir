import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';
import { redirect } from 'next/navigation';
import { PersonalProfile as Profile } from './PersonalProfile';

type UserProfileProps = {
  id: string;
};

export async function UserProfile({ id }: UserProfileProps) {
  const userDataSource = createUserDataSource();
  const { data: foundUser } = await user.findById(userDataSource, { id });

  if (!foundUser) {
    return redirect('/dashboard');
  }

  return <Profile user={foundUser} editable={false} />;
}
