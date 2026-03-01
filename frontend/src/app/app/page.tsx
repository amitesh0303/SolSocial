import { Sidebar } from "@/components/layout/Sidebar";
import { PostComposer } from "@/components/post/PostComposer";
import { PostFeed } from "@/components/post/PostFeed";

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0 max-w-2xl">
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="border-b border-zinc-800 px-4 py-3">
              <h1 className="font-bold text-zinc-100">Feed</h1>
            </div>
            <PostComposer />
            <PostFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
