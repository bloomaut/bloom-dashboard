import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const WishList: React.FC = () => {
  const dict = useTranslations("dict.wishlist");

  return (
    <div className='h-screen w-screen bg-white relative mt-[-1rem] ml-[-2.5vw] overflow-hidden'>
      {/* Ilustración izquierda - Resolución nativa: 416 × 2200 */}
      <div className='hidden lg:block absolute left-0 top-0 h-screen w-auto z-10'>
        <Image
          src='/illustrations/wishlist_left.png'
          alt='Decoración izquierda'
          width={416}
          height={2200}
          className='h-full w-auto object-cover object-left'
          priority
        />
      </div>

      {/* Ilustración derecha - Resolución nativa: 676 × 2200 */}
      <div className='hidden lg:block absolute right-0 top-0 h-screen w-auto z-10'>
        <Image
          src='/illustrations/wishlist_right.png'
          alt='Decoración derecha'
          width={676}
          height={2200}
          className='h-full w-auto object-cover object-right'
          priority
        />
      </div>

      {/* Contenido principal - Tamaños reducidos a la mitad */}
      <div className='relative z-20 h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8 lg:px-32 xl:px-48 overflow-hidden'>
        <div className='w-full max-w-none flex flex-col items-center text-center space-y-4 md:space-y-6'>
          {/* Logo Bloom - Tamaño reducido a la mitad */}
          <div className='w-full flex justify-center'>
            <Image
              src='/bloomLogo.png'
              alt='Bloom Logo'
              width={19894}
              height={6276}
              className='w-full max-w-md md:max-w-xl lg:max-w-3xl h-auto'
              priority
            />
          </div>

          {/* Título - Tamaños reducidos a la mitad */}
          <h2 className='text-base md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 leading-tight'>
            {dict("title")}
          </h2>

          {/* Descripción - Tamaños reducidos a la mitad */}
          <div className='text-base md:text-lg lg:text-xl text-gray-600 w-3/4'>
            <span className='font-bold'>{dict("joined_message")} </span>
            {dict("notification_message")}
          </div>

          {/* Ilustración de flores - Tamaño reducido a la mitad */}
          <div className='w-full flex justify-center pt-4 md:pt-6'>
            <Image
              src='/illustrations/wishlist_flowers.png'
              alt='Flores decorativas'
              width={3072}
              height={2048}
              className='w-full max-w-sm md:max-w-xs lg:max-w-md xl:max-w-xl h-auto'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishList;
