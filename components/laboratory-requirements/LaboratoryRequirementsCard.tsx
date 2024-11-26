import React from 'react';
import Image from 'next/image';

interface WithStylesProps {
  title: string;
  imageurl: string;
}

const LaboratoryRequirementsCard: React.FC<WithStylesProps> = ({ title, imageurl }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 m-4">
      <Image src={imageurl} alt={title} width={300} height={200} className="rounded-2xl max-h-[200px]" />
      <h3 className="mt-2 pt-4 text-lg font-bold text-white text-center">{title}</h3>
    </div>
  );
};

export default LaboratoryRequirementsCard;
