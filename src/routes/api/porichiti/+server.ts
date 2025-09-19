import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { OPENROUTER_API_KEY } from '$env/static/private';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY,
});

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const image = formData.get('image') as File;

        if (!image) {
            return json({ error: 'No image provided' }, { status: 400 });
        }

        if (!image.type.startsWith('image/')) {
            return json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 });
        }

        if (image.size > 10 * 1024 * 1024) {
            return json({ error: 'File size too large. Maximum size is 10MB.' }, { status: 400 });
        }

        const arrayBuffer = await image.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binary);
        const mimeType = image.type;
        const dataUrl = `data:${mimeType};base64,${base64}`;

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Transform this image into a waist-up pixel art portrait of the person. The character should be in a classic retro video game pixel art style, with clean, crisp edges and clearly visible pixels. The person should be holding up one hand in a V sign (peace sign). The character should be centered and maximized within the canvas, filling the frame without being cut off. The background must be solid plain white, with no patterns, shading, or gradients. Ensure the style emphasizes blocky, low-resolution charm with vibrant, flat colors"
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

        return json({
            success: true,
            imageUrl:
                (completion.choices[0].message as unknown as { images: { image_url: { url: string } }[] }).images[0].image_url.url,
        });

    } catch (error) {
        console.error('Error processing image:', error);
        return json(
            { error: 'Failed to process image. Please try again.' },
            { status: 500 }
        );
    }
};
