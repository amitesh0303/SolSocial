"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommunityList } from "@/components/community/CommunityList";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useWallet } from "@solana/wallet-adapter-react";

export default function CommunitiesPage() {
  const { connected } = useWallet();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate() {
    if (!name.trim()) return;
    // TODO: wire to on-chain instruction
    setCreateOpen(false);
    setName("");
    setDescription("");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0 max-w-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-zinc-800 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <h1 className="font-bold text-zinc-100">Communities</h1>
              {connected && (
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  + Create
                </Button>
              )}
            </div>
            <div className="p-4">
              <CommunityList communities={[]} />
            </div>
          </motion.div>
        </div>
      </div>

      <Modal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Community"
        description="Start a new community on SolSocial"
      >
        <div className="flex flex-col gap-4 mt-2">
          <Input
            label="Community name"
            placeholder="solana-devs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">
              Description
            </label>
            <textarea
              placeholder="What is this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:border-purple-500"
            />
          </div>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create Community
          </Button>
        </div>
      </Modal>
    </div>
  );
}
