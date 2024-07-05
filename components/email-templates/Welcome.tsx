import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  userFirstname: string;
}

export const Welcome = ({ userFirstname }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Plataforma para encontrar lugares e restaurantes para ir</Preview>
    <Tailwind>
      <Body className="bg-[#ffffff] font-sans">
        <Container className="mx-auto my-0 pb-12 pt-5">
          <Img
            src="https://raw.githubusercontent.com/SouzaGabriel26/onde-ir/547b50b317bb20a54d84bf9fcb34450682b194e7/assets/photo-restaurant-01.jpg"
            width="400px"
            height="250px"
            alt="onde-ir-logo"
            className="mx-auto my-0"
          />
          <Text className="text-base leading-6">Olá, {userFirstname},</Text>
          <Text className="text-base leading-6">
            Bem vindo a Onde Ir! Estamos muito felizes em ter você conosco. A
            partir de agora, você poderá encontrar os melhores lugares e
            restaurantes para ir.
          </Text>
          <Container className="flex items-center justify-center">
            <Button
              className="mr-2 rounded bg-[#5F51E8] p-3 text-center text-base text-white"
              href="http://localhost:3000/auth/signin"
            >
              Fazer Login
            </Button>

            <Button
              className="ml-2 rounded bg-[#5F51E8] p-3 text-center text-base text-white"
              href="http://localhost:3000/dashboard"
            >
              Entrar
            </Button>
          </Container>
          <Text className="text-base leading-6">
            Se você tiver alguma dúvida, por favor, não hesite em entrar em
            <br />
            contato conosco. Estamos aqui para ajudar!
          </Text>
          <Hr className="mx-0 my-20 border-[#cccccc]" />
          <Text className="text-xs text-[#8898aa]">
            Onde Ir! - Plataforma para encontrar lugares e restaurantes para ir
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
