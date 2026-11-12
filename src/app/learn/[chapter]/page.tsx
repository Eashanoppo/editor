import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CHAPTERS,
  getAdjacentChapters,
  getChapterBySlug,
} from "@/data/chapters";
import { loadChapterMdxData, MdxLessonBody } from "@/lib/mdx";
import { PageContainer } from "@/components/layout/LayoutPrimitives";
import { ChapterSidebar } from "@/components/lessons/ChapterSidebar";
import { ChapterMobileControls } from "@/components/lessons/ChapterMobileControls";
import { ChapterHeader } from "@/components/lessons/ChapterHeader";
import { LessonTableOfContents } from "@/components/lessons/LessonTableOfContents";
import { LessonFooterControls } from "@/components/lessons/LessonFooterControls";

export function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({ chapter: chapter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) {
    return { title: "Chapter Not Found" };
  }
  return {
    title: `Chapter ${String(chapter.number).padStart(2, "0")}: ${chapter.title}`,
    description: chapter.description,
  };
}

function ChapterLessonSkeleton() {
  return (
    <div className="flex items-start gap-8 animate-pulse" aria-hidden="true">
      <div className="hidden w-64 shrink-0 lg:block space-y-2">
        <div className="h-5 w-28 rounded bg-surface-secondary" />
        <div className="h-9 rounded-[8px] bg-surface-secondary" />
        <div className="h-9 rounded-[8px] bg-surface-secondary" />
        <div className="h-9 rounded-[8px] bg-surface-secondary" />
        <div className="h-9 rounded-[8px] bg-surface-secondary" />
      </div>
      <div className="min-w-0 flex-1 max-w-[760px] space-y-4">
        <div className="h-4 w-48 rounded bg-surface-secondary" />
        <div className="h-9 w-3/4 rounded bg-surface-secondary" />
        <div className="h-32 rounded-[10px] border border-border bg-surface" />
        <div className="h-48 rounded-[10px] border border-border bg-surface" />
      </div>
      <div className="hidden w-56 shrink-0 xl:block space-y-2">
        <div className="h-4 w-32 rounded bg-surface-secondary" />
        <div className="h-4 w-40 rounded bg-surface-secondary" />
        <div className="h-4 w-36 rounded bg-surface-secondary" />
      </div>
    </div>
  );
}

async function ChapterLessonContent({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) {
    notFound();
  }

  const mdxData = await loadChapterMdxData(slug);
  if (!mdxData) {
    notFound();
  }

  const { prev, next } = getAdjacentChapters(slug);

  return (
    <div className="flex items-start gap-8">
      {/* Left Sticky Chapter Sidebar */}
      <ChapterSidebar activeSlug={slug} />

      {/* Main Lesson Article */}
      <article className="min-w-0 flex-1 max-w-[760px]">
        <ChapterMobileControls
          activeSlug={slug}
          activeTitle={chapter.title}
          activeNumber={chapter.number}
          headings={mdxData.headings}
        />

        <ChapterHeader chapter={chapter} />

        <div className="mt-6">
          <MdxLessonBody source={mdxData.content} />
        </div>

        <LessonFooterControls chapter={chapter} prev={prev} next={next} />
      </article>

      {/* Right Table of Contents & Progress */}
      <LessonTableOfContents chapter={chapter} headings={mdxData.headings} />
    </div>
  );
}

export default function ChapterLessonPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Suspense fallback={<ChapterLessonSkeleton />}>
          <ChapterLessonContent params={params} />
        </Suspense>
      </PageContainer>
    </div>
  );
}

