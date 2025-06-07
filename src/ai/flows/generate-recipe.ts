'use server';

/**
 * @fileOverview AI agent that generates a recipe given a dish name.
 *
 * - generateRecipe - A function that handles the recipe generation process.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  dishName: z.string().describe('The name of the dish to generate a recipe for.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  ingredients: z.string().describe('A list of ingredients for the recipe.'),
  instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
  prepTime: z.string().describe('The preparation time required for the recipe.'),
  yield: z.string().describe('The yield or serving size of the recipe.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `Você é um chef de cozinha especialista em criar receitas deliciosas.

  Crie uma receita detalhada para o prato: {{{dishName}}}.

  Inclua os seguintes detalhes:

  Ingredientes: Uma lista detalhada dos ingredientes necessários.
  Instruções: Um passo a passo claro de como preparar o prato.
  Tempo de Preparo: O tempo estimado para preparar o prato.
  Rendimento: A quantidade de porções ou unidades que a receita rende.

  Formate a resposta de forma clara e organizada.
  \n  Siga este formato:
  Ingredientes: [lista de ingredientes]
  Instruções: [passo a passo]
  Tempo de Preparo: [tempo]
  Rendimento: [rendimento]
  `,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
