import Image from 'next/image'


export interface AuthorProps {
  firstName?: string;
  lastName?: string;
  name?: string;
  avatarUrl? : string;
}

export default function Avatar({ author }: { author: AuthorProps }) {
  const isAuthorHaveFullName = author.firstName && author.lastName
  const name = isAuthorHaveFullName
    ? `${author.firstName} ${author.lastName}`
    : author.name || "default"

  if(!author.avatarUrl) return null

  return (
    <div className="flex items-center gap-4">
      <Image
        src={author.avatarUrl}
        width={48} // 12 * 4px (w-12)
        height={48} // 12 * 4px (h-12)
        className="rounded-full"
        alt={name}
      />
      <h3 className="text-xl font-bold">{name}</h3>
    </div>
  )
}
