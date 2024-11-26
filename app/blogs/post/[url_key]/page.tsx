import Blog from "@/components/blog/Blog";

export default function Page({ params }: { params: { url_key: string } }) {
    return (
        <>
        <div>
            <Blog singleBlog={true} />
        </div>
        </>
    )
  }