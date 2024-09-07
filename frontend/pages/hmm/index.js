// pages/index.js
import { useState, useEffect } from 'react'

export default function Home() {
    const [count, setCount] = useState(0)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <div>
            <h1>Hydration Example</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            {isClient && <p>This text only appears after hydration</p>}
        </div>
    )
}

