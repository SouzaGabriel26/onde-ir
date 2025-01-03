import { ResetPasswordForm } from './ResetPasswordForm';

type Props = {
  searchParams: Promise<{
    tokenId: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const { tokenId } = searchParams;

  return (
    <div className="space-y-4 md:w-80">
      <h1>Atualização de senha</h1>

      <ResetPasswordForm tokenId={tokenId} />
    </div>
  );
}
