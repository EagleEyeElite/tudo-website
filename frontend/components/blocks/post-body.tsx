import styles from '../post-body.module.css'
import parse, {DOMNode, domToReact, Element} from 'html-react-parser';
import { MdOpenInNew } from 'react-icons/md';
import Image from 'next/image';
import OpenStatusCard from "@/components/blocks/open-status-card";

function Link({ link }) {
  const isExternal = link.href?.startsWith('http://') || link.href?.startsWith('https://');
  const externalAttrs = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a href={link.href} {...externalAttrs} className="inline-flex items-center">
      {link.children}
      {isExternal && <MdOpenInNew/>}
    </a>
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
          return <Link link={{children, href: domNode.attribs.href}}/>;

        case 'openstatus':
          return <OpenStatusCard />;

        default:
          return;
      }
    }
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className={styles.content}>
        {processedContent}
      </div>
    </div>
  );
}
