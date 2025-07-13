
'use client'
import Image from 'next/image';
import React from 'react';

const MainPage = () => {

    return (
        <div className='!bg-main w-screen h-screen flex flex-col gap-4'>
            <h1 className='text-text mt-4 mb-1 p-0 mx-auto text-[24px]'>Watch</h1>
            <p className='mx-auto w-full mt-0 p-0 text-center text-text max-w-[600px]'>Sorry, but the website is down. API access is not possible{`${"("}`}</p>
            <Image
                src='/fiifi.jpg'
                alt='sad'
                width={400}
                height={400}
                className='mx-auto'
            />
            <p className='mx-auto w-full mt-0 p-0 text-center text-text max-w-[600px]'>Contact me if you have any ideas for projects <a className='underline' href="https://t.me/rinatulyd">@rinatulyd</a></p>
        </div>
    );
};

export default MainPage;