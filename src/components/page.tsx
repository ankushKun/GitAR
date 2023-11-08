import Navbar from "./navbar"
export default function Page({ children, title }: { children: React.ReactNode, title: string }) {
    return <div className="bg-[#fdfaf5] min-h-screen p-10 md:px-20">
        <title>{title}</title>
        <Navbar />
        <div className="mx-auto my-10">
            {children}
        </div>
    </div>
}