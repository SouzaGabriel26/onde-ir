import { UserAvatar } from '@/components/UserAvatar';
import { ArrowLeft } from '@/components/icons/ArrowLeft';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createPlaceDataSource } from '@/data/place';
import type { User } from '@/types';
import { Calendar, Edit2Icon, MailIcon } from 'lucide-react';
import Link from 'next/link';

type PersonalProfileProps = {
  user: Partial<User>;
  editable: boolean;
};

export async function PersonalProfile({
  user,
  editable,
}: PersonalProfileProps) {
  const placeDataSource = createPlaceDataSource();
  const placesCreated = placeDataSource.countPlacesByUser({
    userId: user.id ?? '',
  });

  return (
    <div className="grid place-items-center h-full overflow-y-auto relative">
      <Button asChild className="absolute top-5 left-2">
        <Link href="/dashboard">
          <ArrowLeft className="size-6" />
        </Link>
      </Button>

      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <div className="border sm:min-w-[300px] rounded-md p-4 md:p-8 flex flex-col justify-center items-center gap-4">
          <UserAvatar
            className="size-36"
            name={user?.name ?? ''}
            imageUrl={user.avatar_url}
          />

          <div className="flex flex-col items-center gap-2">
            <div className="text-center">
              <h2>{user.name}</h2>
              <span className="text-muted-foreground">@{user.user_name}</span>
            </div>
            <Badge>{user.userRole}</Badge>
          </div>

          {editable && (
            <Button asChild className="w-full flex items-center gap-2">
              <Link href="/dashboard/profile/edit">
                <Edit2Icon className="size-4" />
                <span>Editar perfil</span>
              </Link>
            </Button>
          )}
        </div>

        <div className="border sm:min-w-[400px] rounded-md p-4 md:p-8 space-y-3">
          <h3 className="text-2xl font-medium">Informações do usuário</h3>

          <div className="mt-4">
            <span className="text-muted-foreground text-sm">Email</span>
            <span className="flex gap-2 items-center">
              <MailIcon className="size-4" /> {user.email}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground text-sm block">
              Nome do usuário
            </span>
            <span>@{user.user_name}</span>
          </div>

          <div className="border-b pb-4">
            <span className="text-muted-foreground text-sm block">ID</span>
            <span className="text-sm text-muted-foreground">{user.id}</span>
          </div>

          <div>
            <span className="text-muted-foreground text-sm block">
              Publicações
            </span>
            <span className="flex gap-2">
              <Badge>{placesCreated}</Badge>
              publicações feitas
            </span>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">Membro desde</span>
            <span className="flex gap-2 items-center">
              <Calendar className="size-4" />
              {new Date(user?.createdAt ?? '').toLocaleDateString('pt-br', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
