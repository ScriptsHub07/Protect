
'use server';

/**
 * @fileOverview A recipe suggestion AI agent.
 *
 * - suggestRecipes - A function that handles the recipe suggestion process.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  cuisine: z
    .string()
    .optional()
    .describe('The type of cuisine to get suggestions for, e.g., Italian, Mexican, etc.'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z
    .array(z.string())
    .describe('A list of suggested recipe names based on the cuisine, in Brazilian Portuguese (pt-BR).'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `Você é um assistente de receitas prestativo. Sugira uma lista de receitas em português do Brasil (pt-BR) com base na culinária fornecida.

  {{#if cuisine}}
  Sugira 3 receitas para a culinária {{cuisine}} em português do Brasil (pt-BR).
  {{else}}
  Sugira 3 receitas populares em português do Brasil (pt-BR).
  {{/if}}
  `,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
