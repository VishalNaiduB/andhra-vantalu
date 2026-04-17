import { PortableText } from "@portabletext/react";

export function CulturalStory({
  story,
  recipeName,
}: {
  story: any[];
  recipeName: string;
}) {
  if (!story || story.length === 0) return null;

  return (
    <section className="parchment my-6">
      <h3 className="mb-3 font-heading text-xl text-tamarind-500">
        The Story Behind {recipeName}
      </h3>
      <div className="prose prose-sm text-tamarind-400">
        <PortableText value={story} />
      </div>
    </section>
  );
}
