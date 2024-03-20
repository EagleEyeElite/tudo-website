
export default function Categories({ categories }: { categories: string[]}) {
  return (
    <span className="ml-1">
      under
      {categories.map((category, index) => (
          <span key={index} className="ml-1">
            {category}
          </span>
        ))}
    </span>
  )
}
