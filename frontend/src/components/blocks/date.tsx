import { parseISO, format } from 'date-fns'

interface DateProps {
  dateString: string;
  className?: string;
}

export default function Date({ dateString, className = '' }: DateProps) {
  const date = parseISO(dateString)
  return (
    <time dateTime={dateString} className={className}>
      {format(date, 'LLLL d, yyyy')}
    </time>
  )
}
