import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface IDropdown {
    items: any,
    value?: string,
    onSelect: (item: string) => void
    alt?: boolean;
    containerClass?: string
}


function Dropdown({ items = [], value = "Select", onSelect, alt = false }: IDropdown) {
    const [selected, setSelected] = useState(items.filter(item => item.locale == value)[0]);
    
    const [show, setShow] = useState(false);
    const optionContainerRef = useRef<any>();
    const router = useRouter();
    const localeValue:any = router.locale;

  
    
    const regionItems = items;
    const localeIndex = regionItems.findIndex(item => item.locale == value);
    const selectedRegion = regionItems[localeIndex];
    
    
    
    useEffect(() => {
        if (show && window !== undefined) {
            window.addEventListener('click', (e) => {
                if (optionContainerRef.current && !optionContainerRef.current.contains(e.target)) {
                    setShow(false)
                }
            });
        }
    }, [show, items]);


    return (
        <>
            {/* There are two dropdowns to show multi-menu support */}
            <div ref={optionContainerRef} onClick={() => setShow(!show)} className='z-30 relative' >
                <div className={`${show ? 'flex' : 'flex'} cursor-pointer min-w-[100px]  h-[42px] items-center justify-between bg-white border border-vs-blue text-sm px-[12px] py-[8px] rounded-[7px] text-gray-900`}>
                    <p className=''>{selected?.regionName ?? "Select"}</p>
                    <svg className='chevron-down' xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.79279 7.29357C5.98031 7.1061 6.23462 7.00078 6.49979 7.00078C6.76495 7.00078 7.01926 7.1061 7.20679 7.29357L10.4998 10.5866L13.7928 7.29357C13.885 7.19806 13.9954 7.12188 14.1174 7.06947C14.2394 7.01706 14.3706 6.98947 14.5034 6.98832C14.6362 6.98717 14.7678 7.01247 14.8907 7.06275C15.0136 7.11303 15.1253 7.18728 15.2192 7.28117C15.3131 7.37507 15.3873 7.48672 15.4376 7.60962C15.4879 7.73251 15.5132 7.86419 15.512 7.99697C15.5109 8.12975 15.4833 8.26097 15.4309 8.38297C15.3785 8.50498 15.3023 8.61532 15.2068 8.70757L11.2068 12.7076C11.0193 12.895 10.765 13.0004 10.4998 13.0004C10.2346 13.0004 9.98031 12.895 9.79279 12.7076L5.79279 8.70757C5.60532 8.52004 5.5 8.26573 5.5 8.00057C5.5 7.73541 5.60532 7.4811 5.79279 7.29357Z" fill="#262626" />
                    </svg>
                    {show && <div className='absolute overflow-hidden left-0 right-0 top-[46px] bg-white border border-vs-blue text-sm py-[4px] rounded-[7px] text-gray-900' >
                        <ul className=''>
                            {items.map(item => {
                                return <li className='cursor-pointer hover:bg-gray-200 px-[12px] py-1' key={item.regionName} onClick={() => {
                                    setSelected(item)
                                    onSelect(item.locale)
                                }} >{item.regionName}</li>
                            })}
                        </ul>
                    </div>}
                </div>

            </div>

        </>

    )
}

export default Dropdown