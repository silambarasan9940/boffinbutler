"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; 
import { BsCalendarX } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import Image from 'next/image';

interface BlogPostProps {
  id: string; 
  title: string;
  date: string;
  imageUrl: string;
  content: string;
  author: string;
  url_key?: string;
  contentLength?: number; 
  titleFontSize?: string;  
  singleBlog?: boolean;
}

const BlogPost: React.FC<BlogPostProps> = ({
  id,
  title,
  date,
  imageUrl,
  content,
  url_key,
  singleBlog,
  contentLength = 200,
  titleFontSize = "text-2xl" 
}) => {
  const router = useRouter(); 

  // Function to handle navigation to detailed blog post page
  const handleReadMore = () => {
    router.push(`/blogs/post/${url_key}`); 
  };

  return (
    <div className="max-w-5xl mt-4 mb-8 p-4 bg-white shadow-sm rounded-lg">
      <h1 className={`${titleFontSize} font-bold mb-4 cursor-pointer`} onClick={handleReadMore}>{title}</h1> 
      <div className="flex justify-end items-center text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <span className="flex items-center">
            <BsCalendarX />
            <span className='ps-1'>{date}</span>
          </span>
          <span>|</span>
          <span className="flex items-center">
            <FaEye />
            <span className='ps-1'>174</span>
          </span>
          <span>|</span>
          <span className="flex items-center">
            <HiUser />
            <span className='ps-1'> Admin</span>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <Image
          src={imageUrl}
          alt={title}
          width={600}
          height={350}
         style={{
            width: '100%',
            height: 'auto'
         }}
          className="w-full h-auto object-cover rounded-lg cursor-pointer"
          onClick={handleReadMore}
        />
      </div>
      <p className="text-gray-700">
        {content.substring(0, contentLength)}... 
      </p>
      <button
        onClick={handleReadMore} 
        className="mt-4 text-indigo-600 hover:underline"
      >
        Read More
      </button>
    </div>
  );
};

export default BlogPost;
