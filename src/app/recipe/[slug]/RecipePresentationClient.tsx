
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { generateRecipeImage, type GenerateRecipeImageOutput } from '@/ai/flows/generate-recipe-image';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Clock, Users, Share2, PlusCircle, Image as ImageIcon, AlertTriangle, Bookmark, CheckCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ShareButtons from '@/components/ShareButtons';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';

interface RecipePresentationClientProps {
  initialRecipeData: GenerateRecipeOutput;
  dishName: string;
}

const LOCAL_STORAGE_KEY = 'chefDasReceitas-savedRecipes';

// Helper functions for localStorage
const getSavedRecipesFromLocalStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error reading saved recipes from localStorage:", error);
    return [];
  }
};

const saveRecipeToLocalStorage = (recipeName: string) => {
  if (typeof window === 'undefined') return;
  try {
    const savedRecipes = getSavedRecipesFromLocalStorage();
    if (!savedRecipes.includes(recipeName)) {
      const updatedRecipes = [...savedRecipes, recipeName];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedRecipes));
    }
  } catch (error) {
    console.error("Error saving recipe to localStorage:", error);
  }
};

const removeRecipeFromLocalStorage = (recipeName: string) => {
  if (typeof window === 'undefined') return;
  try {
    const savedRecipes = getSavedRecipesFromLocalStorage();
    const updatedRecipes = savedRecipes.filter(name => name !== recipeName);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error("Error removing recipe from localStorage:", error);
  }
};

const isRecipeSavedInLocalStorage = (recipeName: string): boolean => {
  if (typeof window === 'undefined') return false;
  const savedRecipes = getSavedRecipesFromLocalStorage();
  return savedRecipes.includes(recipeName);
};


export default function RecipePresentationClient({ initialRecipeData, dishName }: RecipePresentationClientProps) {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = React.useState('');
  const [isSaved, setIsSaved] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      setIsSaved(isRecipeSavedInLocalStorage(dishName));
    }
  }, [dishName]);

  React.useEffect(() => {
    async function fetchImage() {
      if (!dishName) {
        setImageUrl('https://placehold.co/600x400.png');
        setImageLoading(false);
        return;
      }
      setImageLoading(true);
      setImageError(null);
      try {
        const imageResult: GenerateRecipeImageOutput = await generateRecipeImage({ recipeName: dishName });
        if (imageResult.imageUrl && imageResult.imageUrl.startsWith('data:image')) {
          setImageUrl(imageResult.imageUrl);
        } else {
          throw new Error("Formato de imagem inválido retornado.");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        let consoleLogMessage = `Failed to generate image for recipe "${dishName}": ${errorMessage}`;
        if (errorMessage.includes("500 Internal Server Error")) {
            consoleLogMessage += ` (This is often a temporary issue with the image generation service. Please try again later.)`;
        }
        console.error(consoleLogMessage);
        setImageError("Não foi possível gerar a imagem da receita.");
        setImageUrl('https://placehold.co/600x400.png');
      } finally {
        setImageLoading(false);
      }
    }
    fetchImage();
  }, [dishName]);

  const formatTextWithLineBreaks = (text: string) => {
    return text.split('\\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const renderSection = (title: string, content: string | undefined, icon?: React.ReactNode) => {
    if (!content || content.trim() === "-") return null;
    return (
      <div className="mb-6">
        <h3 className="text-2xl font-headline font-semibold mb-3 flex items-center text-primary">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h3>
        <p className="text-foreground leading-relaxed whitespace-pre-line">{formatTextWithLineBreaks(content)}</p>
      </div>
    );
  };

  const handleSaveRecipe = () => {
    const currentlySaved = isRecipeSavedInLocalStorage(dishName);
    if (currentlySaved) {
      removeRecipeFromLocalStorage(dishName);
      setIsSaved(false);
      toast({
        title: "Receita Removida",
        description: `${dishName} foi removida das suas receitas salvas.`,
        variant: "default",
      });
    } else {
      saveRecipeToLocalStorage(dishName);
      setIsSaved(true);
      toast({
        title: "Receita Salva!",
        description: `${dishName} foi adicionada às suas receitas salvas.`,
        variant: "default",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden animate-fade-in">
      <CardHeader className="p-0 relative">
        <div className="aspect-video w-full relative bg-muted">
          {imageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 z-10">
              <LoadingSpinner size={48} />
              <p className="mt-2 text-muted-foreground">Gerando imagem da receita...</p>
            </div>
          )}
          {imageError && !imageLoading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive z-10 p-4">
                <AlertTriangle size={48} />
                <p className="mt-2 text-center font-medium">{imageError}</p>
                <p className="text-sm text-center">Exibindo imagem padrão.</p>
            </div>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`Imagem de ${dishName}`}
              fill
              className={`object-cover transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={!imageLoading}
              data-ai-hint={`recipe ${dishName.toLowerCase().replace(/\s+/g, '-')}`}
            />
          )}
           {!imageUrl && !imageLoading && !imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <ImageIcon size={64} className="text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">Sem imagem disponível</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <CardTitle className="text-4xl md:text-5xl font-headline font-bold mb-4 text-center text-primary">{dishName}</CardTitle>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 pb-6 border-b border-border">
          {initialRecipeData.prepTime && initialRecipeData.prepTime.trim() !== "-" && (
            <div className="flex items-center text-muted-foreground">
              <Clock size={20} className="mr-2 text-accent" />
              <span className="font-medium">Preparo:</span>&nbsp;{initialRecipeData.prepTime}
            </div>
          )}
          {initialRecipeData.yield && initialRecipeData.yield.trim() !== "-" && (
            <div className="flex items-center text-muted-foreground">
              <Users size={20} className="mr-2 text-accent" />
              <span className="font-medium">Rendimento:</span>&nbsp;{initialRecipeData.yield}
            </div>
          )}
        </div>

        {renderSection("Ingredientes", initialRecipeData.ingredients, <span className="text-2xl">🥕</span>)}
        {renderSection("Modo de Preparo", initialRecipeData.instructions, <span className="text-2xl">🍳</span>)}

      </CardContent>
      <CardFooter className="p-6 md:p-8 bg-muted/30 flex flex-col sm:flex-row justify-center items-center gap-3 border-t border-border">
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href="/">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Receita
          </Link>
        </Button>
        <Button
          variant={isSaved ? "default" : "outline"}
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleSaveRecipe}
        >
          {isSaved ? <CheckCircle className="mr-2 h-5 w-5" /> : <Bookmark className="mr-2 h-5 w-5" />}
          {isSaved ? "Salva!" : "Salvar Receita"}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Share2 className="mr-2 h-5 w-5" />
              Compartilhar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            {currentUrl && <ShareButtons recipeUrl={currentUrl} recipeTitle={dishName} />}
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}
