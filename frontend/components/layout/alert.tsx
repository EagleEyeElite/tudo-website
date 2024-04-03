import Container from '../ui/container';
import cn from 'classnames';
import Link from "next/link";

export default function Alert({preview}) {
  // Do not render anything if preview mode is not enabled
  if (!preview) return null;

  return (
    <div className={cn('border-b bg-accent-7 border-accent-7 text-white')}>
      <Container>
        <div className="py-2 text-center text-sm">
          <>
            This is a page preview.{' '}
            <Link
              href="/api/exit-preview"
              className="underline hover:text-cyan duration-200 transition-colors"
            >
              Click here
            </Link>{' '}
            to exit preview mode.
          </>
        </div>
      </Container>
    </div>
  );
}
