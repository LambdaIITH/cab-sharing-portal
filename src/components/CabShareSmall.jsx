import { useRouter } from 'next/router';
import React from 'react'

const CabShareSmall = ({bookingData, username, email}) => {
    const router = useRouter();

  const detailedMessageViewHandler = () => {
    router.push(`/`);
  };
  return (
    <div tabIndex="0" className="collapse collapse-arrow border bg-[#EEEEFF]  rounded-none">
  <div className="collapse-title font-medium">
    <div
      className="flex flex-col p-5 mx-5 mt-3 rounded-md bg-[#EEEEFF] cursor-pointer shadow-md border-black/20 border"
      onClick={() => detailedMessageViewHandler()}
    >
      <div className="flex flex-row justify-between  items-center text-gray-800">
        <div className="flex flex-col">
          <h3 className=" tracking-widest text-[1.15rem]">
            {username}
          </h3>
          <p className="text-secondary-pink text-[1rem] ">
           <span className='uppercase'>{email.slice(0, 15)}</span> 
           <span>{email.slice(15, 25)}</span>
          </p>
        </div>
        <div className='flex flex-row gap-5'>
            <div className='flex flex-row gap-2'>

        <p className="text-secondary-pink text-[1.15rem]">Created at:</p>
        <p className=" text-[1.15rem]">2023-07-09</p>
            </div>
        <p className=" text-[1.15rem]">6:00 PM</p>
        </div>
      </div>
      <div className="flex flex-row mt-2 gap-10 ">
        <p className=" tracking-wider text-[1rem] truncate">
          From: {bookingData.from_}
        </p>
        <p className=" tracking-wider text-[1rem] truncate">
          To: {bookingData.to}
        </p>
        <p className=" tracking-wider text-[1rem] truncate">
          Capacity: {bookingData.capacity}
        </p>
      </div>
    </div>
    </div>
  <div className="collapse-content"> 
    <p> attribute is necessary to make the div focusable</p>
  </div>
</div>
  );
}

export default CabShareSmall