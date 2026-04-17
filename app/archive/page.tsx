import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { culturalStoriesQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { REGION_LABELS } from "@/lib/constants";

export const revalidate = 3600;

export default async function ArchivePage() {
  const stories = await sanityClient.fetch(culturalStoriesQuery);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl text-tamarind-500">Cultural Archive</h1>
        <p className="font-telugu mt-1 text-lg text-brass-500">మన వంటకాల కథలు</p>
        <p className="mt-2 text-sm text-tamarind-300">The stories, traditions, and heritage behind Andhra cuisine</p>
      </div>
      <div className="kolam-divider" />
      <div className="space-y-8">
        {stories.map((story: any) => {
          const imageUrl = story.hero_image ? urlFor(story.hero_image).width(600).height(300).url() : null;
          return (
            <article key={story._id} className="parchment">
              {imageUrl && (
                <div className="relative -mx-6 -mt-6 mb-4 aspect-[2/1] overflow-hidden rounded-t">
                  <Image src={imageUrl} alt={story.name_english} fill className="object-cover sepia-[.2]" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <h2 className="font-telugu text-xl text-tamarind-500">{story.name_telugu}</h2>
                <span className="text-sm text-brass-400">({story.name_english})</span>
              </div>
              <p className="mb-3 text-xs text-brass-500">{REGION_LABELS[story.region]}</p>
              <div className="prose prose-sm text-tamarind-400 line-clamp-6">
                <PortableText value={story.cultural_story} />
              </div>
              <Link href={`/recipe/${story.slug.current}`} className="mt-3 inline-block text-sm text-curry-red-500 hover:underline">
                View full recipe →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
