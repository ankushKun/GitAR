import { Toaster } from 'react-hot-toast';
import Navbar from "./navbar"
import Footer from './footer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page({ children, title, wallet }: { children: React.ReactNode, title: string, wallet: any }) {
    return <div className="bg-[#fdfaf5] min-h-screen h-screen">
        <Toaster />
        <title>{title}</title>
        <div className='p-10 md:px-20 min-h-[85vh]'>
            <Navbar wallet={wallet} />
            <div className="mx-auto my-10">
                {children}
            </div>
        </div>
        <Footer />
    </div>
}