import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-primary font-bold text-primary-foreground">
      <Link href="/" className="flex items-center gap-2 ml-3">
        <Image 
          src='/dumbbell.svg' 
          width={30} 
          height={30} 
          alt="Dumbbell (logo for the website)"
          priority
	  className="w-5 h-5"
        />
        <span className="p-3">
          Home
        </span>
      </Link>
      <div className="me-4 flex items-center gap-5 p-3">
        <Link href="/plans">
          Plans
        </Link>

        <Link href="/account">
          Account
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
