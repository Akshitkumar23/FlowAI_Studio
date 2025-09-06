'use server';
/**
 * @fileOverview Converts text to speech, supporting both single-narrator and multi-speaker dialogue.
 *
 * - textToSpeech - A function that handles the text-to-speech conversion.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  multiSpeakerMode: z
    .boolean()
    .default(false)
    .describe('Whether to use multi-speaker mode.'),
  voice1: z.string().optional().describe('The voice for the first speaker.'),
  voice2: z.string().optional().describe('The voice for the second speaker.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The audio data in WAV format as a data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (input) => {
    const {text, multiSpeakerMode, voice1, voice2} = input;

    const config = {
      responseModalities: ['AUDIO'] as const,
      speechConfig: multiSpeakerMode
        ? {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: 'Speaker1',
                  voiceConfig: {
                    prebuiltVoiceConfig: {voiceName: voice1 || 'Algenib'},
                  },
                },
                {
                  speaker: 'Speaker2',
                  voiceConfig: {
                    prebuiltVoiceConfig: {voiceName: voice2 || 'Achernar'},
                  },
                },
              ],
            },
          }
        : {
            voiceConfig: {
              prebuiltVoiceConfig: {voiceName: voice1 || 'Algenib'},
            },
          },
    };

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config,
      prompt: text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
