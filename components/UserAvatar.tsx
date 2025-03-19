import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

type AvatarProps = {
  imageUrl?: string;
  name: string;
  className?: string;
};

export function UserAvatar({ name, imageUrl, className }: AvatarProps) {
  const nameArray = name.split(' ');

  const nameInitials =
    nameArray.length > 1
      ? nameArray[0].charAt(0) + nameArray[1].charAt(0)
      : nameArray[0].slice(0, 2).toUpperCase();

  return (
    <Avatar className={className}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback>{nameInitials}</AvatarFallback>
    </Avatar>
  );
}
