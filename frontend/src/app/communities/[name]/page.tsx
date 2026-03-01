import { Sidebar } from "@/components/layout/Sidebar";
import { PostFeed } from "@/components/post/PostFeed";
import { CommunityList } from "@/components/community/CommunityList";

interface CommunityPageProps {
  params: Promise<{ name: string }>;
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { name } = await params;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0 max-w-2xl">
          {/* Community header */}
          <div className="rounded-2xl border border-zinc-800 overflow-hidden mb-4">
            <div className="h-20 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900" />
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 -mt-8 mb-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-2xl ring-4 ring-zinc-950">
                  {name.charAt(0).toUpperCase()}
                </div>
              </div>
              <h1 className="font-bold text-xl text-zinc-100">{name}</h1>
              <p className="text-zinc-500 text-sm mt-0.5">Community on SolSocial</p>
            </div>
          </div>

          {/* Posts */}
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="border-b border-zinc-800 px-4 py-3">
              <h2 className="font-bold text-zinc-100">Posts</h2>
            </div>
            <PostFeed />
          </div>
        </div>

        {/* Right sidebar for communities list */}
        <div className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-20">
            <div className="rounded-2xl border border-zinc-800 p-4">
              <h3 className="font-semibold text-zinc-100 mb-3">Other Communities</h3>
              <CommunityList communities={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
