
'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import RecipeCard from '@/components/RecipeCard';
import { BookmarkCheck, Info, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Metadata for static export, not dynamically used by client component itself
// export const metadata: Metadata = {
//   title: 'Receitas Salvas | Chef das Receitas',
//   description: 'Veja todas as suas receitas salvas no Chef das Receitas.',
// };

const LOCAL_STORAGE_KEY = 'chefDasReceitas-savedRecipes';

export default function SavedRecipesPage() {
  const [savedRecipes, setSavedRecipes] = React.useState<{ name: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        const recipeNames: string[] = saved ? JSON.parse(saved) : [];
        setSavedRecipes(recipeNames.map(name => ({ name })));
      } catch (error) {
        console.error("Error reading saved recipes from localStorage:", error);
        setSavedRecipes([]); // Set to empty if there's an error
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false); // Not in browser, no localStorage
    }
  }, []);

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center justify-center mb-4">
            <BookmarkCheck size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-primary">
            Minhas Receitas Salvas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aqui você encontra todas as delícias que você guardou para depois.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Carregando receitas salvas...</p>
        </div>
      ) : savedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipeName={recipe.name} />
          ))}
        </div>
      ) : (
        <Card className="w-full max-w-lg mx-auto text-center shadow-lg bg-card rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-xl font-headline">
              <Info className="mr-3 h-7 w-7 text-primary" />
              Nenhuma Receita Salva Ainda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Parece que você ainda não salvou nenhuma receita. Comece a explorar e salve suas favoritas!
            </p>
            <Button asChild>
              <Link href="/">Explorar Receitas</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
