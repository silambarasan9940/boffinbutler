import React from 'react';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import BlogPost from '@/components/blog/BlogPost';
import BlogCard from '@/components/blog/BlogCard';
import { postdata } from '@/components/blog/BlogPostData';
interface blog{
  singleBlog?: boolean;
}

const Blog = ({singleBlog}:blog) => {
  return (
    <>
      <Breadcrumbs />
      <div className='w-11/12 mx-auto'>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-2/3 space-y-8'>
            {singleBlog === false? postdata.map((post, index) => (
              <BlogPost
                key={post.url_key}
                id={index.toString()} 
                title={post.title}
                date={post.date}
                imageUrl={post.imageUrl}
                content={post.content}
                url_key={post.url_key}
                singleBlog={singleBlog}
                author={post.author}
              />
            )): <BlogPost
            key={postdata[0].url_key}
            id='1' 
            title={postdata[0].title}
            date={postdata[0].date}
            imageUrl={postdata[0].imageUrl}
            content={postdata[0].content}
            url_key={postdata[0].url_key}
            singleBlog={singleBlog}
            author={postdata[0].author}
          />}
          </div>
          <div className='w-full md:w-1/3'>
            <BlogCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
