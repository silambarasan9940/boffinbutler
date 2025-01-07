"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdChevronRight } from "react-icons/md";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <div className="w-11/12 mx-auto pt-10 md:pt-6 pb-4 px-4">
      <nav aria-label="breadcrumb py-3">
      <ol className="flex flex-wrap text-gray-500">
        
        <li className='flex items-center'>
          <Link href="/">
            <span className="text-gray-500 hover:text-blue-600">Home</span>
          </Link>
          <span><MdChevronRight className='text-xl'/></span>
        </li>

        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const href = `/${pathnames.slice(0, index + 1).join('/')}`;

          return isLast ? (
            <li key={index} className="text-black">
              {value}
            </li>
            
          ) : (
            <li key={index} className='flex items-center'>
              <Link href={href}>
                <span className="text-black hover:text-blue-600 capitalize">{value}</span>
              </Link>
              <span><MdChevronRight className='text-xl'/></span>
            </li>
          );
        })}
      </ol>
    </nav>
    </div>
    
  );
};

export default Breadcrumbs;
