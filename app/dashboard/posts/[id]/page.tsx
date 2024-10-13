type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  const { id: postId } = params;

  return <div>Status do post {postId}</div>;
}
