import { verify } from '@/utils/verify';
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
      {isLoggedUserProfile ? <div>Seu perfil</div> : <UserProfile id={id} />}
    </div>
  );
}
