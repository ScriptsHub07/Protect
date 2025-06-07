import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Cpu, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre | Chef das Receitas',
  description: 'Saiba mais sobre o Chef das Receitas e como nossa IA cria pratos deliciosos.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl rounded-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <ChefHat size={48} className="text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">Sobre o Chef das Receitas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg leading-relaxed text-foreground">
          <section>
            <h2 className="text-2xl font-headline font-semibold mb-3 flex items-center text-primary">
              <Lightbulb size={24} className="mr-2" />
              Nossa Missão
            </h2>
            <p>
              Bem-vindo ao <strong>Chef das Receitas</strong>! Nossa paixão é simplificar sua vida na cozinha,
              transformando a busca por receitas em uma experiência rápida, divertida e inspiradora.
              Queremos que qualquer pessoa, desde o cozinheiro iniciante ao chef experiente,
              possa descobrir e preparar pratos incríveis com facilidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-semibold mb-3 flex items-center text-primary">
              <Cpu size={24} className="mr-2" />
              Como Funciona a Mágica?
            </h2>
            <p>
              Utilizamos o poder da Inteligência Artificial (IA) para gerar receitas personalizadas
              instantaneamente. Quando você digita o nome de uma comida, nossa IA entra em ação:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4 text-base">
              <li><strong>Análise Inteligente:</strong> A IA compreende o prato que você deseja.</li>
              <li><strong>Criação da Receita:</strong> Ela consulta uma vasta base de conhecimento culinário para montar uma lista de ingredientes e um passo a passo detalhado.</li>
              <li><strong>Detalhes Essenciais:</strong> Informações como tempo de preparo e rendimento são calculadas para ajudar no seu planejamento.</li>
              <li><strong>Inspiração Visual:</strong> Para complementar, uma imagem ilustrativa do prato é gerada, aguçando ainda mais seu apetite!</li>
            </ul>
            <p className="mt-3">
              Nosso objetivo é fornecer receitas claras, práticas e deliciosas, tudo isso com a ajuda da
              tecnologia de ponta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-semibold mb-3 text-primary">
              Explore, Crie e Saboreie!
            </h2>
            <p>
              Estamos constantemente aprimorando nossa plataforma para trazer novas funcionalidades
              e tornar sua jornada culinária ainda mais prazerosa. Explore nossas sugestões,
              gere suas próprias receitas e divirta-se na cozinha!
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
