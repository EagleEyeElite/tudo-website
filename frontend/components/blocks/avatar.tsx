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
    <div className="flex items-center">
      <div className="w-12 h-12 relative mr-4">
        <Image
          src={author.avatarUrl}
          fill
          className="rounded-full"
          alt={name}
          sizes="100%"
        />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  )
}
