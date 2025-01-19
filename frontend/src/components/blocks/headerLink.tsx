import Link from 'next/link'
import {MdArrowBack} from 'react-icons/md';

export interface HeaderLinkProps {
  title: string,
  href: string
}

export default function HeaderLink({title, href}: HeaderLinkProps) {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 ">
      <Link href={href} className="group inline-flex items-center">
        <MdArrowBack className="mr-2 group-hover:-translate-x-1 transition-transform duration-100" />
        <span className="group-hover:underline">{title}</span>.
      </Link>
    </h2>
  )
}
