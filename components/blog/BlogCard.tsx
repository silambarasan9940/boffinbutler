"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import BlogPost from "./BlogPost";
import { postdata } from '@/components/blog/BlogPostData';


const BlogCard: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"popular" | "latest">("popular");

  const handleTabClick = (tab: "popular" | "latest") => {
    setActiveTab(tab);
  };

  const handleMonthPost = () => {
    router.push('/blogs/month');
  };

  return (
    <>
      <div className="mt-4 border border-gray-300 rounded-md">
        <div className="w-full bg-gray-50 p-4">
          <div className="flex items-center max-w-md mx-auto border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search blog posts..."
              className="w-full px-4 py-2 focus:outline-none"
            />
            <button className="px-4 py-4 bg-indigo-500 text-white">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-4">
          <button
            className={`px-4 py-2 ${activeTab === "popular" ? "border-b-2 border-indigo-500 text-indigo-500" : "text-gray-500"}`}
            onClick={() => handleTabClick("popular")}
          >
            Popular
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "latest" ? "border-b-2 border-indigo-500 text-indigo-500" : "text-gray-500"}`}
            onClick={() => handleTabClick("latest")}
          >
            Latest
          </button>
        </div>

        {/* Blog Posts */}
        <div>
          {activeTab === "popular" ? (
            <div className="mx-2">
              {postdata.map((post, index) => (
                <BlogPost
                  key={post.url_key}
                  id={index.toString()} 
                  title={post.title}
                  date={post.date}
                  imageUrl={post.imageUrl}
                  content={post.content}
                  url_key={post.url_key}
                  titleFontSize="text-sm" 
                  contentLength={50} 
                  author={post.author}
                />
              ))}
            </div>
          ) : (
            <div >
              {postdata.map((post, index) => (
                <BlogPost
                  key={post.url_key}
                  id={index.toString()}
                  title={post.title}
                  date={post.date}
                  imageUrl={post.imageUrl}
                  content={post.content}
                  url_key={post.url_key}
                  titleFontSize="text-sm" 
                  contentLength={50} 
                  author={post.author}
                />
              ))}
            </div>
          )}
        </div>

        {/* Monthly Archive */}
        <div className="mt-8 p-4">
          <div className="border-b-2 pb-2">
            <h3 className="text-xl font-semibold">Monthly Archive</h3>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <div
                className="flex flex-row items-center text-gray-600 bg-gray-100 py-2 px-4 rounded-full cursor-pointer"
                onClick={handleMonthPost}
              >
                <span className="flex flex-row items-center pe-2">
                  <FiCalendar className="mr-2" />
                  September 2024 
                </span>
                <span> (10)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wish List */}
      <div className="h-auto bg-gray-200 p-4 rounded-lg md:my-3">
        <div className="text-xl font-semibold text-gray-600 border-b border-gray-300 pb-2">My Wish List</div>
        <p className="py-6">You have no items in your wish list.</p>
      </div>
    </>
  );
};

export default BlogCard;
