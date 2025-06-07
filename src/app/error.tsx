'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-12 px-4 min-h-[calc(100vh-18rem)] flex flex-col items-center justify-center text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-headline font-bold mb-2">Oops! Algo deu errado.</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Não foi possível carregar esta página. Por favor, tente novamente ou volte para o início.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          variant="outline"
        >
          Tentar Novamente
        </Button>
        <Button asChild>
          <Link href="/">Voltar para Início</Link>
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && error?.message && (
          <p className="mt-4 text-xs text-muted-foreground">Detalhes do erro: {error.message}</p>
      )}
    </div>
  );
}
