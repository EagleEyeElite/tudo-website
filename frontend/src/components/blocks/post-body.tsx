import parse, {DOMNode, domToReact, Element} from 'html-react-parser';
import { MdOpenInNew } from 'react-icons/md';
import Image from 'next/image';
import OpenStatusCard from '@/components/blocks/open-status-card';
import Link from 'next/link';
import { HTMLRenderer } from '@/components/render/renderWordpress';


function CustomLink({ link }) {
  const isExternal = link.href?.startsWith('http://') || link.href?.startsWith('https://');
  const externalAttrs = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Link href={link.href} {...externalAttrs} className="inline-flex items-center underline">
      {link.children}
      {isExternal && <MdOpenInNew/>}
    </Link>
  );
}

export default function PostBody({content}: { content: string | null }) {
  return <HTMLRenderer content={content} />;
}
