import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface ForgetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordTokenId?: string;
}

const baseUrl = 'http://localhost:3000';

export const ForgetPasswordEmail = ({
  userFirstname,
  resetPasswordTokenId,
}: ForgetPasswordEmailProps) => {
  const resetPasswordLink = `${baseUrl}/auth/reset-password?tokenId=${resetPasswordTokenId}`;

  return (
    <Html>
      <Head />
      <Preview>Onde Ir - esquecimento de senha</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-3">
          <Container className="border border-[#f0f0f0] bg-[#ffffff] p-11">
            <Section>
              <Text className="font-light leading-6 text-[#404040]">
                Olá, {userFirstname},
              </Text>
              <Text className="font-light leading-6 text-[#404040]">
                Recebemos uma solicitação para redefinir a senha da sua conta.
                Essa solicitação irá durar 5 minutos. Clique no botão abaixo
                para criar uma nova senha.
              </Text>
              <Button
                className="block w-52 rounded bg-[#007ee6] px-2 py-3 text-center text-[#fff]"
                href={resetPasswordLink}
              >
                Mudar senha
              </Button>
              <Text className="font-light leading-6 text-[#404040]">
                Se você não solicitou uma redefinição de senha, ignore este
                e-mail.
              </Text>
              <Text className="font-light leading-6 text-[#404040]">
                Para manter sua conta segura, não compartilhe este e-mail com
                ninguém.
              </Text>
              <Text className="font-light leading-6 text-[#404040]">
                Obrigado por usar nosso serviço, esperamos vê-lo em breve!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
