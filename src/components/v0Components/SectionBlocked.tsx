"use client";

import { TutorialStepper } from "./TutorialStepper";

interface SectionBlockedProps {
  title: string;
  description: string;
}

export function SectionBlocked({ title, description }: SectionBlockedProps) {
  return (
    <div className='flex-1 flex flex-col overflow-hidden '>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6 flex items-center justify-center'>
        <div className='mx-auto '>
          <TutorialStepper />
        </div>
      </main>
    </div>
  );
}
