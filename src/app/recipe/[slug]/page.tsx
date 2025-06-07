import { generateRecipe, type GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import RecipePresentationClient from './RecipePresentationClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const dishName = decodeURIComponent(params.slug);
  return {
    title: `Receita de ${dishName} | Chef das Receitas`,
    description: `Descubra como fazer ${dishName} com nossa receita gerada por IA.`,
  };
}

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const dishName = decodeURIComponent(params.slug);
  let recipeData: GenerateRecipeOutput | null = null;
  let error: string | null = null;

  try {
    recipeData = await generateRecipe({ dishName });
    if (!recipeData.ingredients || !recipeData.instructions) {
        throw new Error("Dados da receita incompletos retornados pela IA.");
    }
  } catch (e) {
    console.error(`Failed to generate recipe for "${dishName}":`, e instanceof Error ? e.message : String(e));
    error = `Não foi possível gerar a receita para "${dishName}". Verifique o nome e tente novamente, ou tente mais tarde.`;
  }

  if (error || !recipeData) {
    return (
      <div className="container mx-auto py-12 px-4 min-h-[calc(100vh-18rem)] flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg text-center shadow-xl bg-card rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-destructive font-headline text-2xl">
              <AlertTriangle className="mr-3 h-8 w-8" />
              Erro ao Gerar Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error || "Ocorreu um erro desconhecido ao buscar os detalhes da receita."}</p>
            <Button asChild variant="default">
              <Link href="/">Voltar para Início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RecipePresentationClient initialRecipeData={recipeData} dishName={dishName} />;
}
