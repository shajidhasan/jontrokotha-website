import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENROUTER_API_KEY } from '$env/static/private';
import { storage } from '$lib/server/appwrite';
import { ID } from 'node-appwrite';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY,
});

const savePortrait = async (base64Data: string): Promise<void> => {
    try {
        const binaryString = atob(base64Data);
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: 'image/png' });
        const file = new File([blob], `portrait-${Date.now()}.png`, {
            type: 'image/png'
        });

        await storage.createFile(
            {
                bucketId: '68d10cd300136c70d4a7',
                fileId: ID.unique(),
                file: file
            }
        );
    } catch (error) {
        console.error('Error saving portrait:', error);
        throw new Error('Failed to save portrait to storage');
    }
}

export const POST = async ({ request }) => {
    try {
        const { image: dataUrl, mimeType, pose = 'v-sign' } = await request.json();

        if (!dataUrl) {
            return json({ error: 'No image provided' }, { status: 400 });
        }

        if (!mimeType || !mimeType.startsWith('image/')) {
            return json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 });
        }

        const base64Data = dataUrl.split(',')[1];
        if (!base64Data) {
            return json({ error: 'Invalid image data format' }, { status: 400 });
        }

        const getPosePrompt = (poseType: string): string => {
            const basePrompt = "Transform this image into a waist-up pixel art portrait of the person. If the original image does not include the waist, construct the missing portion so the result is waist-up. If the original image already includes the waist or more, crop it to waist-up. The character should be in a classic retro video game pixel art style, with clean, crisp edges and clearly visible pixels.";
            const endPrompt = "The character should be centered and maximized within the canvas, filling the frame without being cut off. The background must be solid plain white, with no patterns, shading, or gradients. Ensure the style emphasizes blocky, low-resolution charm with vibrant, flat colors";

            const posePrompts = {
                'v-sign': `${basePrompt} The person should be holding up one hand in a V sign (peace sign). ${endPrompt}`,
                'crying': `${basePrompt} The person should be crying with visible tears streaming down their face, with a sad expression and maybe some tear drops spraying from their eyes. ${endPrompt}`,
                'flexing': `${basePrompt} The person should be flexing their arm muscles, showing off their strength with a confident expression, with one or both arms bent to display their biceps. ${endPrompt}`,
                'thinking': `${basePrompt} The person should be in a thinking pose with one hand placed thoughtfully on their chin or temple, with a contemplative and pondering expression. ${endPrompt}`
            };

            return posePrompts[poseType as keyof typeof posePrompts] || posePrompts['v-sign'];
        };

        const completionPromise = openai.chat.completions.create({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": getPosePrompt(pose)
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": dataUrl
                            }
                        }
                    ]
                }
            ],
        });

        const [completion] = await Promise.all([
            completionPromise,
            savePortrait(base64Data)
        ])

        const generatedImageUrl = (completion.choices[0].message as unknown as { images: { image_url: { url: string } }[] }).images[0].image_url.url;

        return json({
            success: true,
            imageUrl: generatedImageUrl,
        });

    } catch (error) {
        console.error('Error processing image:', error);
        return json(
            { error: 'Failed to process image. Please try again.' },
            { status: 500 }
        );
    }
};
