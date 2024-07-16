import Link from "next/link";
export default function Navbar(){
    return (
        <nav>
            <Link href ={"/"}>NUNA TECH
            </Link>
            <Link href ={"/Products"}>Products
            </Link>
        </nav>
    )
}