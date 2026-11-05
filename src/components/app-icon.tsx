import Image from 'next/image';

export default function AppIcon() {
  return (
    <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-xl p-2 shadow-md">
      <Image 
        src="/dumbbell.svg" 
        alt="App Icon" 
        width={32} 
        height={32} 
      />
    </div>
  );
}