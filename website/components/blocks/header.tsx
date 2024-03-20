import Link from 'next/link'

interface Props {
  category?: string;
}

export default function Header({category}: Props) {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
      <Link href="/" className="hover:underline">
        {category ?? "General"}
      </Link>
      .
    </h2>
  )
}
