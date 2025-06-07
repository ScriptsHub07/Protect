import { suggestRecipes, type SuggestRecipesOutput } from '@/ai/flows/suggest-recipes';
import RecipeCard from './RecipeCard';
import { Utensils } from 'lucide-react';

export default async function RecipeSuggestionList() {
  let suggestions: SuggestRecipesOutput | null = null;
  let error: string | null = null;

  try {
    suggestions = await suggestRecipes({}); // Fetch popular recipes
  } catch (e) {
    console.error("Failed to fetch recipe suggestions:", e instanceof Error ? e.message : String(e));
    error = "Não foi possível carregar as sugestões no momento.";
  }

  return (
    <section className="py-8">
      <h3 className="text-3xl font-headline font-semibold mb-8 text-center flex items-center justify-center gap-2">
        <Utensils className="h-8 w-8 text-primary" />
        Sugestões Populares
      </h3>
      {error && <p className="text-center text-destructive">{error}</p>}
      {suggestions && suggestions.recipes && suggestions.recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suggestions.recipes.map((recipeName, index) => (
            <RecipeCard key={index} recipeName={recipeName} />
          ))}
        </div>
      ) : (
        !error && <p className="text-center text-muted-foreground">Nenhuma sugestão disponível no momento.</p>
      )}
    </section>
  );
}
