import Header from "@/app/components/Header";
import { Tag } from "@/app/utils/interface";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";

async function getAllTags() {
  const query = `
    *[_type=="tag"] {
    _id,
    slug,
   name,
    "postCount": count(*[_type =="post" && references("tags", ^._id)])
}
    `;

  const tags = client.fetch(query);
  return tags;
}

export const revalidate = 60;

const page = async () => {
  const tags: Tag[] = await getAllTags();
  console.log("TAGS: ", tags);

  if (!tags) {
    notFound();
    return;
  }
  return (
    <div>
      <Header title="Tags" />
      <div>
        {tags?.length > 0 &&
          tags?.map((tag) => (
            <Link href={`/tag/${tag?.slug?.current}`} key={tag._id}>
              <div className="mb-2 p-2 text-sm lowercase dark:bg-gray-950 border dark:border-gray-900 hover:text-purple-500">
                #{tag.name} ({tag?.postCount})
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default page;
