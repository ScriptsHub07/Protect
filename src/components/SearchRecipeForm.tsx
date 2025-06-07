"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const formSchema = z.object({
  dishName: z.string().min(2, {
    message: "O nome da comida deve ter pelo menos 2 caracteres.",
  }),
});

export default function SearchRecipeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dishName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    router.push(`/recipe/${encodeURIComponent(values.dishName)}`);
    // setIsSubmitting(false) will not be reached if navigation is successful
    // If navigation fails or this component is still mounted, set to false
    // For robustness, this state should ideally be managed if the component could persist through navigation attempts
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-4">
        <FormField
          control={form.control}
          name="dishName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Nome da Comida</FormLabel>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Digite o nome da comida (ex: Bolo de Chocolate)" 
                    {...field} 
                    className="pl-10 text-lg h-14 rounded-md shadow-sm focus:ring-2 focus:ring-primary" 
                    aria-label="Digite o nome da comida"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full h-14 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground shadow-md" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoadingSpinner size={24} className="mr-2" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          Gerar Receita
        </Button>
      </form>
    </Form>
  );
}
