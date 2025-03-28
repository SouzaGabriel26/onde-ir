import { verify } from '@/utils/verify';
import { redirect } from 'next/navigation';
import { EditProfile } from './EditProfile';

export default async function Page() {
  const { data: user } = await verify.loggedUser();

  if (!user) {
    return redirect('/dashboard');
  }

  return <EditProfile user={user} />;
}
