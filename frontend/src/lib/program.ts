import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program, BN, web3 } from "@coral-xyz/anchor";
import type { AnchorWallet } from "@solana/wallet-adapter-react";

// Minimal IDL shape – extend with full IDL when available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IDL: any = {
  version: "0.1.0",
  name: "sol_social",
  address: process.env.NEXT_PUBLIC_PROGRAM_ID ?? "11111111111111111111111111111111",
  metadata: {
    address: process.env.NEXT_PUBLIC_PROGRAM_ID ?? "11111111111111111111111111111111",
  },
  instructions: [
    {
      name: "createProfile",
      accounts: [
        { name: "profile", isMut: true, isSigner: false },
        { name: "user", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "username", type: "string" },
        { name: "displayName", type: "string" },
        { name: "bio", type: "string" },
        { name: "avatarUri", type: "string" },
      ],
    },
    {
      name: "createPost",
      accounts: [
        { name: "post", isMut: true, isSigner: false },
        { name: "author", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "content", type: "string" },
        { name: "mediaUri", type: "string" },
        { name: "community", type: "string" },
      ],
    },
    {
      name: "likePost",
      accounts: [
        { name: "like", isMut: true, isSigner: false },
        { name: "post", isMut: true, isSigner: false },
        { name: "user", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "createComment",
      accounts: [
        { name: "comment", isMut: true, isSigner: false },
        { name: "post", isMut: true, isSigner: false },
        { name: "author", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "content", type: "string" }],
    },
    {
      name: "followUser",
      accounts: [
        { name: "followRecord", isMut: true, isSigner: false },
        { name: "followerProfile", isMut: true, isSigner: false },
        { name: "followingProfile", isMut: true, isSigner: false },
        { name: "follower", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "tipPost",
      accounts: [
        { name: "post", isMut: true, isSigner: false },
        { name: "postAuthor", isMut: true, isSigner: false },
        { name: "tipper", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
  ],
  accounts: [
    {
      name: "Profile",
      type: {
        kind: "struct",
        fields: [
          { name: "wallet", type: "publicKey" },
          { name: "username", type: "string" },
          { name: "displayName", type: "string" },
          { name: "bio", type: "string" },
          { name: "avatarUri", type: "string" },
          { name: "followersCount", type: "u64" },
          { name: "followingCount", type: "u64" },
          { name: "postsCount", type: "u64" },
          { name: "createdAt", type: "i64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "Post",
      type: {
        kind: "struct",
        fields: [
          { name: "author", type: "publicKey" },
          { name: "content", type: "string" },
          { name: "mediaUri", type: "string" },
          { name: "likesCount", type: "u64" },
          { name: "commentsCount", type: "u64" },
          { name: "tipsTotal", type: "u64" },
          { name: "createdAt", type: "i64" },
          { name: "community", type: "string" },
        ],
      },
    },
  ],
};

export function getSocialProgram(
  connection: Connection,
  wallet: AnchorWallet
): Program {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(IDL, provider);
}

const PROGRAM_PUBKEY = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID ?? "11111111111111111111111111111111"
);

export async function getProfilePDA(wallet: PublicKey): Promise<PublicKey> {
  const [pda] = await PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), wallet.toBuffer()],
    PROGRAM_PUBKEY
  );
  return pda;
}

export async function getPostPDA(
  author: PublicKey,
  nonce: number
): Promise<PublicKey> {
  const [pda] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from("post"),
      author.toBuffer(),
      Buffer.from(new BN(nonce).toArray("le", 8)),
    ],
    PROGRAM_PUBKEY
  );
  return pda;
}

export async function getLikePDA(
  user: PublicKey,
  post: PublicKey
): Promise<PublicKey> {
  const [pda] = await PublicKey.findProgramAddressSync(
    [Buffer.from("like"), user.toBuffer(), post.toBuffer()],
    PROGRAM_PUBKEY
  );
  return pda;
}

export async function getFollowPDA(
  follower: PublicKey,
  following: PublicKey
): Promise<PublicKey> {
  const [pda] = await PublicKey.findProgramAddressSync(
    [Buffer.from("follow"), follower.toBuffer(), following.toBuffer()],
    PROGRAM_PUBKEY
  );
  return pda;
}

export async function buildCreateProfileTx(
  program: Program,
  wallet: PublicKey,
  username: string,
  displayName: string,
  bio: string,
  avatarUri: string
) {
  const profilePDA = await getProfilePDA(wallet);
  return program.methods
    .createProfile(username, displayName, bio, avatarUri)
    .accounts({
      profile: profilePDA,
      user: wallet,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
}

export async function buildCreatePostTx(
  program: Program,
  author: PublicKey,
  content: string,
  mediaUri = "",
  community = "",
  nonce = Date.now()
) {
  const postPDA = await getPostPDA(author, nonce);
  return program.methods
    .createPost(content, mediaUri, community)
    .accounts({
      post: postPDA,
      author,
      systemProgram: web3.SystemProgram.programId,
    })
    .transaction();
}

export async function buildLikePostTx(
  program: Program,
  user: PublicKey,
  postAddress: PublicKey
) {
  const likePDA = await getLikePDA(user, postAddress);
  return program.methods
    .likePost()
    .accounts({
      like: likePDA,
      post: postAddress,
      user,
      systemProgram: web3.SystemProgram.programId,
    })
    .transaction();
}

export async function buildFollowTx(
  program: Program,
  follower: PublicKey,
  following: PublicKey
) {
  const followPDA = await getFollowPDA(follower, following);
  const followerProfile = await getProfilePDA(follower);
  const followingProfile = await getProfilePDA(following);
  return program.methods
    .followUser()
    .accounts({
      followRecord: followPDA,
      followerProfile,
      followingProfile,
      follower,
      systemProgram: web3.SystemProgram.programId,
    })
    .transaction();
}

export async function buildTipPostTx(
  program: Program,
  tipper: PublicKey,
  postAddress: PublicKey,
  postAuthor: PublicKey,
  amountLamports: number
) {
  return program.methods
    .tipPost(new BN(amountLamports))
    .accounts({
      post: postAddress,
      postAuthor,
      tipper,
      systemProgram: web3.SystemProgram.programId,
    })
    .transaction();
}
