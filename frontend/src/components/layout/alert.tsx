import Container from '@/components/ui/container';
import cn from 'classnames';
import { draftMode } from 'next/headers';

export default async function Alert() {
  const { isEnabled } = await draftMode();

  // Do not render anything if preview mode is not enabled
  if (!isEnabled) return null;

  return (
    <div className={cn('border-b bg-accent-7 border-accent-7 text-white')}>
      <Container>
        <div className="py-2 text-center text-sm">
          <>
            This is a page preview.{' '}
            <form action="/api/exit-preview" method="GET" className="inline">
              <button type="submit" className="underline hover:text-cyan duration-200 transition-colors">
                Click here
              </button>
            </form>{' '}
            to exit preview mode.
          </>
        </div>
      </Container>
    </div>
  );
}
