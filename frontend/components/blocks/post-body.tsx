import styles from '../post-body.module.css'
import parse, {DOMNode, domToReact, Element} from 'html-react-parser';
import { MdOpenInNew } from 'react-icons/md';


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
      if (domNode.name === 'a') {
        const children = domToReact(domNode.children as DOMNode[])
        return <Link link={{children, href: domNode.attribs.href}} />;
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
