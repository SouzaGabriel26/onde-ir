import { verify } from '@/utils/verify';
import { PersonalProfile } from '../_components/PersonalProfile';
import { UserProfile } from '../_components/UserProfile';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const { data: user } = await verify.loggedUser();

  const isLoggedUserProfile = user && user.id === id;

  return (
    <div>
      {isLoggedUserProfile ? (
        <PersonalProfile user={user} editable />
      ) : (
        <UserProfile id={id} />
      )}
    </div>
  );
}
