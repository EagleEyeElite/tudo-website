import parse, { DOMNode, domToReact, Element } from 'html-react-parser';
import { MdOpenInNew } from 'react-icons/md';
import Image from 'next/image';
import OpenStatusCard from '@/components/blocks/open-status-card';
import Link from 'next/link';
import { ReactNode } from 'react';

interface CustomLinkProps {
  link: {
    href: string;
    children: ReactNode;
  };
}

function CustomLink({ link }: CustomLinkProps) {
  const isExternal = link.href?.startsWith('http://') || link.href?.startsWith('https://');
  const externalAttrs = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Link href={link.href} {...externalAttrs} className="inline-flex items-center">
      {link.children}
      {isExternal && <MdOpenInNew />}
    </Link>
  );
}

// WordPress specific image styles that aren't covered by @tailwindcss/typography
const WP_IMAGE_STYLES = `
  [&_.wp-block-image_img]:max-w-full 
  [&_.wp-block-image_img]:mt-2
  
  [&_.wp-block-image.aligncenter]:text-center
  [&_.wp-block-image.alignfull_img]:w-full
  [&_.wp-block-image.alignwide_img]:w-full
  
  [&_.wp-block-image_.alignleft]:float-left
  [&_.wp-block-image_.alignleft]:mr-4
  
  [&_.wp-block-image_.alignright]:float-right
  [&_.wp-block-image_.alignright]:ml-4
  
  [&_.wp-block-image_.aligncenter]:m-auto
`;

interface HTMLRendererProps {
  content: string | null;
  className?: string;
  proseSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
}

export function HTMLRenderer({
                               content,
                               className = '',
                               proseSize = 'lg'
                             }: HTMLRendererProps) {
  if (!content) {
    return null;
  }

  const processedContent = parse(content, {
    replace(domNode) {
      if (!(domNode instanceof Element && domNode.attribs)) {
        return;
      }
      switch (domNode.name) {
        case 'img':
          const { src, alt, width, height } = domNode.attribs;
          return (
            <Image
              src={src}
              width={Number.parseInt(width)}
              height={Number.parseInt(height)}
              alt={alt || 'image'}
              className="object-cover"
            />
          );

        case 'a':
          const children = domToReact(domNode.children as DOMNode[]);
          return <CustomLink link={{ children, href: domNode.attribs.href }} />;

        case 'openstatus':
          return <OpenStatusCard />;

        default:
          return;
      }
    }
  });

  const proseClasses = proseSize === 'base' ? 'prose' : `prose prose-${proseSize}`;
  const combinedClasses = `max-w-2xl mx-auto ${proseClasses} ${WP_IMAGE_STYLES} ${className}`;

  return (
    <div className={combinedClasses}>
      {processedContent}
    </div>
  );
}
