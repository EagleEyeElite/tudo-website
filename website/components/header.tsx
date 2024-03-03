import Link from 'next/link'

interface Props {
  categories: any;
}

export default function Header({categories}: Props) {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
      <Link href="/" className="hover:underline">
        {categories?.edges[0]?.node.name ?? "General"}
      </Link>
      .
    </h2>
  )
}
