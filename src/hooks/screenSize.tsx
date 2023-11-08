import { useState, useEffect } from "react"

export default function useScreenSize() {
    const [screenSize, setScreenSize] = useState(window.innerWidth)
    useEffect(() => {
        function handleResize() {
            setScreenSize(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    return screenSize
}