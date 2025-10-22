import parse, { DOMNode, domToReact, Element, Text } from 'html-react-parser';
import { MdOpenInNew } from 'react-icons/md';
import Image from 'next/image';
import OpenStatusCard from '@/components/blocks/open-status-card';
import Lineup, { LineupFloor } from '@/components/blocks/lineup';
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

interface HTMLRendererProps {
  content: string | null;
  className?: string;
}

export function HTMLRenderer({
                               content,
                               className = ''
                             }: HTMLRendererProps) {
  if (!content) {
    return null;
  }

  const processedContent = parse(content, {
    replace(domNode) {
      if (!(domNode instanceof Element)) {
        return;
      }
      switch (domNode.name) {
        case 'img': {
          const { src, alt, width, height } = domNode.attribs;
          const alignmentClass = (domNode.parent as Element)?.attribs?.class?.match(/align(left|right|center|wide|full)/)?.[0] || '';

          return (
            <Image
              src={src}
              width={Number.parseInt(width)}
              height={Number.parseInt(height)}
              alt={alt || 'image'}
              style={{ objectFit: 'cover' }}
              className={`
                mt-2 
                [&.alignfull]:w-full 
                [&.alignwide]:w-full
                [&.alignleft]:float-left [&.alignleft]:mr-4
                [&.alignright]:float-right [&.alignright]:ml-4
                [&.aligncenter]:mx-auto
                ${alignmentClass}
              `}
            />
          );
        }

        case 'a': {
          const children = domToReact(domNode.children as DOMNode[]);
          return <CustomLink link={{ children, href: domNode.attribs.href }} />;
        }

        case 'openstatus':
          return <div className={"not-prose"}>
            <OpenStatusCard />
          </div>;

        case 'lineup': {
          // Extract JSON data from the 'data' attribute
          if (!domNode.attribs?.data) {
            throw new Error('Lineup tag requires a "data" attribute with JSON lineup data');
          }

          let lineupData: LineupFloor[];
          try {
            lineupData = JSON.parse(domNode.attribs.data);
          } catch (error) {
            console.error('Failed to parse lineup JSON data:', error);
            throw new Error('Invalid JSON in lineup data attribute');
          }

          return <div className={"not-prose"}>
            <Lineup data={lineupData} />
          </div>;
        }

        default:
          return;
      }
    }
  });

  return (
    <div className={`text-lg prose leading-relaxed ${className}`}>
      {processedContent}
    </div>
  );
}
