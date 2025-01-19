export default function ContainerWide({ children }) {
  return <div className="container mx-auto px-5">{children}</div>
}

export function ContainerTight({ children }) {
  return <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
}
