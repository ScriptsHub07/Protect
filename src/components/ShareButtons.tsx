'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, MessageSquare } from "lucide-react"; // Using MessageSquare for WhatsApp like icon

interface ShareButtonsProps {
  recipeUrl: string;
  recipeTitle: string;
}

export default function ShareButtons({ recipeUrl, recipeTitle }: ShareButtonsProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recipeUrl).then(() => {
      toast({
        title: "Link Copiado!",
        description: "O link da receita foi copiado para a área de transferência.",
      });
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast({
        title: "Erro ao Copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    });
  };

  const shareText = `Confira esta receita deliciosa de ${recipeTitle}!`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(recipeUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + recipeUrl)}`;

  return (
    <div className="p-4 space-y-3 bg-popover rounded-md shadow-lg border border-border">
      <h4 className="text-sm font-medium text-popover-foreground text-center mb-2">Compartilhar Receita</h4>
      <div className="flex space-x-2">
        <Input type="text" value={recipeUrl} readOnly className="text-sm" aria-label="Link da receita"/>
        <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copiar link">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-around pt-2">
        <Button variant="ghost" size="sm" asChild className="text-popover-foreground hover:bg-accent/10">
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Twitter">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Twitter</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-popover-foreground hover:bg-accent/10">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">
            <MessageSquare className="h-5 w-5" />
          </a>
        </Button>
         <Button variant="ghost" size="sm" onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: recipeTitle,
                text: shareText,
                url: recipeUrl,
              }).catch(console.error);
            } else {
              copyToClipboard();
              toast({ description: "Compartilhamento nativo não disponível. Link copiado." });
            }
          }} 
          className="text-popover-foreground hover:bg-accent/10"
          aria-label="Mais opções de compartilhamento"
          >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
