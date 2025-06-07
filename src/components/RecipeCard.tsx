
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ImageIcon, AlertTriangle } from 'lucide-react';
import { generateRecipeImage, type GenerateRecipeImageOutput } from '@/ai/flows/generate-recipe-image';
import LoadingSpinner from '@/components/LoadingSpinner';

interface RecipeCardProps {
  recipeName: string;
}

export default function RecipeCard({ recipeName }: RecipeCardProps) {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [imageError, setImageError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchCardImage() {
      if (!recipeName) {
        setImageUrl('https://placehold.co/300x200.png'); // Fallback placeholder
        setImageLoading(false);
        return;
      }
      setImageLoading(true);
      setImageError(null);
      try {
        const imageResult: GenerateRecipeImageOutput = await generateRecipeImage({ recipeName });
        if (imageResult.imageUrl && imageResult.imageUrl.startsWith('data:image')) {
          setImageUrl(imageResult.imageUrl);
        } else {
          throw new Error("Formato de imagem inválido retornado.");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        let consoleLogMessage = `Failed to generate image for card "${recipeName}": ${errorMessage}`;
        if (errorMessage.includes("500 Internal Server Error")) {
            consoleLogMessage += ` (This is often a temporary issue with the image generation service. Please try again later.)`;
        }
        console.error(consoleLogMessage);
        setImageError("Erro ao gerar imagem.");
        setImageUrl('https://placehold.co/300x200.png'); // Fallback placeholder on error
      } finally {
        setImageLoading(false);
      }
    }
    fetchCardImage();
  }, [recipeName]);

  // Prepare a hint for AI image search, using first two words of recipe name
  const recipeNameKeywords = recipeName.split(' ').slice(0, 2).join(' ').toLowerCase();

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full bg-muted">
          {imageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 z-10">
              <LoadingSpinner size={32} />
              <p className="text-xs mt-1 text-muted-foreground">Gerando imagem...</p>
            </div>
          )}
          {imageError && !imageLoading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive-foreground z-10 p-2 text-center">
                <AlertTriangle size={32} className="text-destructive" />
                <p className="text-xs mt-1 font-medium">{imageError}</p>
            </div>
          )}
          {imageUrl && ( // Render Image component only if imageUrl is available
            <Image
              src={imageUrl}
              alt={`Imagem de ${recipeName}`}
              fill
              className={`object-cover transition-opacity duration-500 ${imageLoading || imageError ? 'opacity-0' : 'opacity-100'}`}
              sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 22vw"
              data-ai-hint={recipeNameKeywords}
              onError={() => {
                  // This handles errors if the browser fails to load the image src (e.g. malformed data URI)
                  if (!imageError) { // Prevent re-triggering if error already set
                    console.error(`Error loading image src for card "${recipeName}"`);
                    setImageError("Imagem inválida.");
                    setImageUrl('https://placehold.co/300x200.png');
                  }
              }}
              priority={false} // Suggested images are not LCP typically
            />
          )}
           {/* Fallback for initial state or if imageUrl is null after loading without specific error state */}
           {!imageUrl && !imageLoading && !imageError && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
                <ImageIcon size={40} className="text-muted-foreground/50" />
             </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-headline mb-2 line-clamp-2 leading-tight h-14">
          {recipeName}
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground">
          <Link href={`/recipe/${encodeURIComponent(recipeName)}`}>
            Ver Receita
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
