// Date: 03.08.2021
// Time: 19:00
// Author: Dastan
// Description: Main page
'use client'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState} from 'react';

const MainPage = () => {

    const [players, setPlayers] = useState<{iframeUrl: string, source: string}[]>();
    const router = useRouter();
    const params = useSearchParams();
    const [loading, setLoading] = useState(false);

    const [theid, setId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [error, setError] = useState<string | null>(null)

    const [type, setType] = useState<'kinopoisk' | 'imdb' | 'title'>('kinopoisk');

    const [open, setOpen] = useState(false);
    const [player, setPlayer] = useState(0);

    const [modal, setModal] = useState(false);

    useEffect(() => {
        
        const queryType = params.get('type')?.trim();
        const query = params.get('q')?.trim();

        const getRes = async (type: string, query: string) => {
            setLoading(true);
            const res = await axios.get<{ iframeUrl: string; source: string; }[]>(`https://kinobox.tv/api/players?${type}=${query}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .finally(() => {
                setLoading(false)
            });

            return res.data
        }

        if (queryType && query){
            const searchRes = getRes(queryType, query);

            searchRes
            .then((res) => {
                if (res && res.length > 0) {
                    const uniqueSources: { [key: string]: boolean } = {};
                    const filteredPlayers = res.filter(player => {
                        if (!uniqueSources[player.source]) {
                            uniqueSources[player.source] = true;
                            return true;
                        }
                        return false;
                    });
                    setPlayers(filteredPlayers);
                }
                else {
                    setError('The movie could not be found, please enter the correct ID or name')
                }
            })
            .catch((err) => {
                console.log(err);
            })
            
        }
    }, [params])

    const handleClick = async () => {
        const queryType = params.get('type')?.trim();
        const query = params.get('q')?.trim();
        if (queryType === type && query === (type === 'title' ? title : theid)) return;
        router.push(`?type=${type}&q=${type === 'title' ? title : theid}`);
        setLoading(true)
    };

    
    
    

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            const target = event.target as Element;
    
            if (!target.closest('#dropdown') && !target.closest('.dropdown-button')) {
                setOpen(false);
            }
        };
    
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleModal = () => {
        setModal(true)
    }

    return (
        <div className='!bg-main w-screen h-screen flex flex-col gap-4'>
            <h1 className='text-text mt-4 mb-1 p-0 mx-auto text-[24px]'>Watch</h1>
            <p className='mx-auto w-full mt-0 p-0 text-center text-text max-w-[600px]'>Don&apos;t waste time searching for a movie viewing site. Just enter an ID or name of the film and start eating your delicious dish!</p>
            <div className="w-full phone:w-[calc(100%-1rem)] max-w-[500px] mx-auto flex items-center gap-2">
                { type !== 'title' && <button className='bg-[white] outline-0 hover:bg-opacity-40 duration-150 text-[white] bg-opacity-20 py-2 px-4 rounded-[8px]' onClick={handleModal}>?</button>}
                <div className='relative w-max flex'>
                    
                    <button className='bg-[white] outline-0 w-[120px] hover:bg-opacity-40 justify-center duration-150 text-[white] bg-opacity-20 py-2 rounded-[8px] flex items-center gap-1' onClick={() => { setOpen(!open);}}>
                        {type === 'kinopoisk' ? 'Kinopoisk' : type === 'imdb' ? 'Imdb' : 'Name'}
                        {!open && <Image width={12} height={12} alt='arrow' src={require('../assets/arrow.svg').default} className='block' />}
                    </button>

                    {
                        open &&     <div id='dropdown' className='absolute top-[calc(100%+4px)] bg-[#5B595A] rounded-[8px] w-full flex flex-col items-center z-[1000]'>
                                        <p className='text-text cursor-pointer p-2 bg-[white] bg-opacity-0 w-full text-center hover:bg-opacity-40 rounded-[8px]' onClick={() => {setType('kinopoisk'); setOpen(false); setId(''); setTitle('');}}>Kinopoisk</p>
                                        <p className='text-text cursor-pointer p-2 bg-[white] bg-opacity-0 w-full text-center hover:bg-opacity-40 rounded-[8px]' onClick={() => {setType('imdb'); setOpen(false); setId(''); setTitle('');}}>Imdb</p>
                                        <p className='text-text cursor-pointer p-2 bg-[white] bg-opacity-0 w-full text-center hover:bg-opacity-40 rounded-[8px]' onClick={() => {setType('title'); setOpen(false); setId(''); setTitle('');}}>Name</p>
                                    </div>
                    }
                </div>
                <input type="text" value={type === 'title' ? title : theid} className=' bg-[white] outline-0 text-[white] bg-opacity-20 placeholder:text-[rgba(255,255,255,0.7)] rounded-[8px] w-full text-[1rem] py-2 px-4' placeholder={type === 'kinopoisk' ? 'id: 324' : type === 'imdb' ? 'id: tt0264464' : 'Catch Me If You Can'} onChange={(e) => type === 'title' ? setTitle(e.target.value) : setId(e.target.value)} />
                <button className='bg-[white] outline-0 hover:bg-opacity-40 duration-150 text-[white] bg-opacity-20 py-2 px-4 rounded-[8px]' onClick={handleClick}>Search</button>
                
            </div>

            {
                players ?
                <div className='flex mx-auto items-center gap-4 relative mt-6'>
                    <iframe src={players[player].iframeUrl} allowFullScreen width={698} className='rounded-[8px] phone:w-[calc(100%-4px)] phone:h-[200px]' height={398}  />
                    <div className='flex flex-col phone:flex-row phone:flex-wrap items-center gap-2 absolute left-[calc(100%+1rem)] phone:left-0 phone:top-[calc(100%+1rem)] max-h-[400px] overflow-y-scroll phone:max-h-[200px]'>
                        {
                            players.map((player, id) => {
                                return <button onClick={() => setPlayer(id)} key={id} className='p-2 px-3 w-full phone:w-max rounded-[8px] bg-[white] bg-opacity-20 text-text'>{player.source}</button>
                            })
                        }
                    </div>
                </div>
                :
                type === 'kinopoisk' ?
                    <Image  src={require('../assets/ScreenRecording2024-02-21at13.11.40-ezgif.com-video-to-gif-converter.gif').default} alt='modal' width={698} height={398} className='mx-auto phone:w-[calc(100%-1rem)]' />
                :
                type === 'imdb' ?
                    <Image src={require('../assets/ScreenRecording2024-02-21at13.22.19-ezgif.com-video-to-gif-converter.gif').default} alt='modal' width={698} height={398}  className='mx-auto phone:w-[calc(100%-1rem)]'/>
                    :
                    <div className='w-[698px] phone:w-[calc(100%-1rem)] h-[389px] bg-[rgba(0,0,0,0.4)] rounded-[8px] mx-auto mt-6 flex'>
                    </div>
            }

            {
                modal && 
                <div className='flex items-center justify-center fixed z-[100000] top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.7)]' onClick={() => setModal(false)}>
                    {
                        type === 'kinopoisk' ?
                            <Image src={require('../assets/ScreenRecording2024-02-21at13.11.40-ezgif.com-video-to-gif-converter.gif').default} alt='modal' width={698} height={398} />
                        :
                            <Image src={require('../assets/ScreenRecording2024-02-21at13.22.19-ezgif.com-video-to-gif-converter.gif').default} alt='modal' width={698} height={398} />
                    }
                    
                </div>
            }

            {
                error && 
                <div className='fixed flex top-0 bottom-0 left-0 bg-[rgba(0,0,0,0.7)] right-0 z-[100000] items-center justify-center' onClick={() => setError(null)}>
                    <p className='p-4 text-[white] rounded-[8px] bg-[#1f1f1f] w-[calc(100%-1rem)] text-center'>{error}</p>
                </div>
            }

            <p className='phone:w-[calc(100%-2rem)] text-text text-center !text-[14px] opacity-[0.5] mt-auto mx-auto mb-4'>If you encounter an error or want to suggest something - write to <Link target='_blank' href={'https://t.me/rinatulyd'} className='text-text'>@rinatulyd</Link> 😊 </p>

            {
                loading &&  <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)]'>
                                <div
                                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] border-[white]"
                                    role="status">
                                    <span
                                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                    >Loading...</span>
                                </div>
                            </div>
            }

        </div>
    );
};

export default MainPage;