'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating multiple preview images based on a text prompt and optional reference images.
 *
 * - generatePreviewImages - A function that generates multiple preview images based on a text prompt and optional reference images.
 * - GeneratePreviewImagesInput - The input type for the generatePreviewImages function.
 * - GeneratePreviewImagesOutput - The return type for the generatePreviewImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePreviewImagesInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate images from.'),
  referenceImage1: z
    .string()
    .optional()
    .describe(
      "An optional reference image 1, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  referenceImage2: z
    .string()
    .optional()
    .describe(
      "An optional reference image 2, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  referenceImage3: z
    .string()
    .optional()
    .describe(
      "An optional reference image 3, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  numImages: z
    .number()
    .min(1)
    .max(4)
    .default(3)
    .describe('The number of preview images to generate (1-4).'),
});
export type GeneratePreviewImagesInput = z.infer<typeof GeneratePreviewImagesInputSchema>;

const GeneratePreviewImagesOutputSchema = z.object({
  images: z.array(z.string()).describe('An array of generated image data URIs.'),
});
export type GeneratePreviewImagesOutput = z.infer<typeof GeneratePreviewImagesOutputSchema>;

export async function generatePreviewImages(
  input: GeneratePreviewImagesInput
): Promise<GeneratePreviewImagesOutput> {
  return generatePreviewImagesFlow(input);
}

const generatePreviewImagesFlow = ai.defineFlow(
  {
    name: 'generatePreviewImagesFlow',
    inputSchema: GeneratePreviewImagesInputSchema,
    outputSchema: GeneratePreviewImagesOutputSchema,
  },
  async input => {
    const {
      prompt,
      referenceImage1,
      referenceImage2,
      referenceImage3,
      numImages,
    } = input;

    const imagePromises = [];

    for (let i = 0; i < numImages; i++) {
      const messages = [
        {text: prompt},
      ] as any[];

      if (referenceImage1) {
        messages.push({media: {url: referenceImage1}});
      }
      if (referenceImage2) {
        messages.push({media: {url: referenceImage2}});
      }
      if (referenceImage3) {
        messages.push({media: {url: referenceImage3}});
      }

      imagePromises.push(
        ai
          .generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: messages,
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          })
          .then(result => {
            return result.media?.url;
          })
      );
    }

    const images = (await Promise.all(imagePromises)).filter(Boolean) as string[];

    return {images};
  }
);
