import Navbar from "./navbar"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page({ children, title, wallet }: { children: React.ReactNode, title: string, wallet: any }) {
    return <div className="bg-[#fdfaf5] min-h-screen p-10 md:px-20">
        <title>{title}</title>
        <Navbar wallet={wallet} />
        <div className="mx-auto my-10">
            {children}
        </div>
    </div>
}