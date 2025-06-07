import SearchRecipeForm from '@/components/SearchRecipeForm';
import RecipeSuggestionList from '@/components/RecipeSuggestionList';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-lg shadow-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-primary">
            Encontre Sua Próxima Receita Favorita!
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Digite o nome de uma comida ou ingrediente e deixe nossa IA criar uma receita deliciosa para você.
          </p>
          <SearchRecipeForm />
        </div>
      </section>

      <Separator />

      <RecipeSuggestionList />
    </div>
  );
}
