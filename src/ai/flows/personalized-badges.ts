'use server';

/**
 * @fileOverview Generates personalized badges based on user click rates.
 * 
 * - generateBadge - A function that generates personalized badge descriptions based on click rates.
 * - GenerateBadgeInput - The input type for the generateBadge function.
 * - GenerateBadgeOutput - The return type for the generateBadge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBadgeInputSchema = z.object({
  clickRate: z.number().describe('The user\u2019s click rate.'),
});
export type GenerateBadgeInput = z.infer<typeof GenerateBadgeInputSchema>;

const GenerateBadgeOutputSchema = z.object({
  badgeDescription: z.string().describe('A description of the personalized badge.'),
});
export type GenerateBadgeOutput = z.infer<typeof GenerateBadgeOutputSchema>;

export async function generateBadge(input: GenerateBadgeInput): Promise<GenerateBadgeOutput> {
  return generateBadgeFlow(input);
}

const badgePrompt = ai.definePrompt({
  name: 'badgePrompt',
  input: {schema: GenerateBadgeInputSchema},
  output: {schema: GenerateBadgeOutputSchema},
  prompt: `You are a creative badge designer who is creating a personalized badge for a user based on their click rate.

  The user's click rate is {{{clickRate}}}.

  Create a short, but descriptive badge description that is tailored to the user's click rate. The description should be inspiring and make the user feel a sense of accomplishment.
`,
});

const generateBadgeFlow = ai.defineFlow(
  {
    name: 'generateBadgeFlow',
    inputSchema: GenerateBadgeInputSchema,
    outputSchema: GenerateBadgeOutputSchema,
  },
  async input => {
    const {output} = await badgePrompt(input);
    return output!;
  }
);
