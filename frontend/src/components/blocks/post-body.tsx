import parse, {DOMNode, domToReact, Element} from 'html-react-parser';
import { MdOpenInNew } from 'react-icons/md';
import Image from 'next/image';
import OpenStatusCard from '@/components/blocks/open-status-card';
import Link from 'next/link';


function CustomLink({ link }) {
  const isExternal = link.href?.startsWith('http://') || link.href?.startsWith('https://');
  const externalAttrs = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Link href={link.href} {...externalAttrs} className="inline-flex items-center">
      {link.children}
      {isExternal && <MdOpenInNew/>}
    </Link>
  );
}

export default function PostBody({content}: { content: string | null }) {
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
          return <CustomLink link={{children, href: domNode.attribs.href}}/>;

        case 'openstatus':
          return <OpenStatusCard />;

        default:
          return;
      }
    }
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`
        text-lg leading-relaxed
      
        [&>p]:my-6 
        [&>ul]:my-6 
        [&>ol]:my-6 
        [&>blockquote]:my-6
      
        [&>a]:underline
      
        [&>ul]:pl-4 
        [&>ol]:pl-4
        [&>ul]:list-disc
        [&>ol]:list-decimal
      
        [&>ul>li>ul]:my-0 
        [&>ul>li>ul]:ml-4 
        [&>ol>li>ol]:my-0 
        [&>ol>li>ol]:ml-4
        [&>ul>li>ul]:list-[circle]
      
        [&>h2]:text-3xl 
        [&>h2]:mt-12 
        [&>h2]:mb-4 
        [&>h2]:leading-snug
      
        [&>h3]:text-2xl 
        [&>h3]:mt-8 
        [&>h3]:mb-4 
        [&>h3]:leading-snug
      
        [&>h4]:text-xl 
        [&>h4]:mt-6 
        [&>h4]:mb-4 
        [&>h4]:leading-snug
      
        [&>pre]:whitespace-pre 
        [&>pre]:overflow-x-auto 
        [&>pre]:p-4 
        [&>pre]:text-sm 
        [&>pre]:leading-tight 
        [&>pre]:border 
        [&>pre]:border-gray-400 
        [&>pre]:bg-gray-100
      
        [&>code]:text-sm
      
        [&>figcaption]:text-center 
        [&>figcaption]:text-sm
      
        [&>blockquote]:border-l-4 
        [&>blockquote]:border-gray-500 
        [&>blockquote]:bg-gray-200 
        [&>blockquote]:italic 
        [&>blockquote]:ml-0 
        [&>blockquote]:py-4 
        [&>blockquote]:px-6
      
        [&>blockquote>p]:mt-0
        [&>blockquote>cite]:not-italic
      
        [&>audio]:w-full
      `}>
        {processedContent}
      </div>
    </div>
  );
}
