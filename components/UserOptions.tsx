import type { User } from '@/types';
import { constants } from '@/utils/constants';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UserAvatar } from './UserAvatar';
import { Button } from './ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';

type UserOptionsProps = {
  user: Partial<User>;
};

async function signOut() {
  'use server';

  (await cookies()).delete(constants.accessTokenKey);

  return redirect('/auth/signin');
}

export function UserOptions({ user }: UserOptionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-fit p-0 rounded-full" variant="ghost">
          <UserAvatar name={user.name ?? ''} imageUrl={user?.avatarUrl} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="mt-4 flex flex-col gap-2 w-full">
          <Button className="w-full" variant="outline" asChild>
            <Link href="#">Perfil {user.name ? `de: ${user.name}` : ''}</Link>
          </Button>

          <form action={signOut}>
            <Button className="w-full" type="submit">
              Sair
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
