import { ImageResponse } from 'next/og';

/**
 * This is the OG route. It is used to generate the Open Graph image for the website.
 * Open Graph images are used to display a preview of the website when shared on social media.
 */

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div tw="w-full h-full flex-col flex items-center justify-center text-white bg-slate-700">
        <h1 tw="text-[10rem] mb-0 font-bold tracking-tighter leading-tight">TuDo</h1>
        <h2 tw="mt-[-20] text-5xl font-bold tracking-tighter">Makerspace & Café</h2>
      </div>
    ),
  );
}
