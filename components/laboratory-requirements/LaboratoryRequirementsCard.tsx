import React from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface WithStylesProps {
  title: string;
  imageurl: string;
 url_key: string;
}

const LaboratoryRequirementsCard: React.FC<WithStylesProps> = ({ title, imageurl,url_key }) => {
  const router = useRouter();
  const handleClick = (url_key:string) => {
    router.push(`/products/${url_key}`);
  }
  return (
    <div className="max-w-sm p-4 m-4 bg-white shadow-lg rounded-xl">
  <div className="relative cursor-pointer" onClick={()=>handleClick(url_key)}>
    {/* Card Image */}
    <Image
      src={imageurl}
      alt={title}
      width={300}
      height={250}
      className="rounded-t-xl w-full max-h-[200px] object-cover"
    />
  </div>
  {/* Title Section */}
  <div className="relative group mt-4">
    <h3 className="text-lg font-bold text-center text-gray-800">
      {title.length < 20 ? title : title.substring(0, 20) + "..."}
    </h3>
    {/* Hover Tooltip */}
    <div className="absolute left-0 bottom-full mb-1 hidden max-w-xs break-words px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg group-hover:block">
      {title}
    </div>
  </div>
</div>

  );
};

export default LaboratoryRequirementsCard;
