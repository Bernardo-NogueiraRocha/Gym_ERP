import Image from "next/image";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gym ERP',
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p className="text-black">Hello world</p>
    </div>
  );
}
