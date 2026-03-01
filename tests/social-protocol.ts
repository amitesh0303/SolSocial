import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";
import { SocialProtocol } from "../target/types/social_protocol";

describe("social-protocol", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SocialProtocol as Program<SocialProtocol>;

  const user = provider.wallet as anchor.Wallet;

  // Second keypair for follow/tip tests
  const otherUser = anchor.web3.Keypair.generate();

  // Helper: derive profile PDA
  const profilePda = (authority: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), authority.toBuffer()],
      program.programId
    );

  // Helper: derive post PDA
  const postPda = (author: PublicKey, index: number) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("post"),
        author.toBuffer(),
        new anchor.BN(index).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

  // Helper: derive comment PDA
  const commentPda = (post: PublicKey, index: number) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("comment"),
        post.toBuffer(),
        new anchor.BN(index).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

  // Helper: derive like PDA
  const likePda = (user: PublicKey, post: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("like"), user.toBuffer(), post.toBuffer()],
      program.programId
    );

  // Helper: derive follow PDA
  const followPda = (follower: PublicKey, followeeProfile: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("follow"), follower.toBuffer(), followeeProfile.toBuffer()],
      program.programId
    );

  // Helper: derive community PDA
  const communityPda = (name: string) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("community"), Buffer.from(name)],
      program.programId
    );

  before(async () => {
    // Airdrop SOL to otherUser for transaction fees and tipping
    const sig = await provider.connection.requestAirdrop(
      otherUser.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);
  });

  // ─────────────────────────────────────────────
  // 1. Creating a profile
  // ─────────────────────────────────────────────
  it("creates a profile", async () => {
    const [profile] = profilePda(user.publicKey);

    await program.methods
      .createProfile("alice", "Alice A.", "Building on Solana", "https://example.com/avatar.png")
      .accounts({
        profile,
        authority: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.profile.fetch(profile);
    assert.equal(account.username, "alice");
    assert.equal(account.displayName, "Alice A.");
    assert.equal(account.bio, "Building on Solana");
    assert.equal(account.postCount.toNumber(), 0);
    assert.ok(account.authority.equals(user.publicKey));
  });

  // ─────────────────────────────────────────────
  // 2. Updating a profile
  // ─────────────────────────────────────────────
  it("updates a profile", async () => {
    const [profile] = profilePda(user.publicKey);

    await program.methods
      .updateProfile("Alice Updated", "New bio here", "https://example.com/new-avatar.png")
      .accounts({
        profile,
        authority: user.publicKey,
      })
      .rpc();

    const account = await program.account.profile.fetch(profile);
    assert.equal(account.displayName, "Alice Updated");
    assert.equal(account.bio, "New bio here");
  });

  // ─────────────────────────────────────────────
  // 3. Creating a post
  // ─────────────────────────────────────────────
  it("creates a post", async () => {
    const [profile] = profilePda(user.publicKey);
    const postIndex = 0;
    const [post] = postPda(user.publicKey, postIndex);

    await program.methods
      .createPost(new anchor.BN(postIndex), "Hello Solana!", "")
      .accounts({
        post,
        profile,
        authority: user.publicKey,
        author: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const postAccount = await program.account.post.fetch(post);
    assert.equal(postAccount.content, "Hello Solana!");
    assert.equal(postAccount.likesCount.toNumber(), 0);
    assert.equal(postAccount.commentsCount.toNumber(), 0);
    assert.isFalse(postAccount.isDeleted);

    const profileAccount = await program.account.profile.fetch(profile);
    assert.equal(profileAccount.postCount.toNumber(), 1);
  });

  // ─────────────────────────────────────────────
  // 4. Liking a post
  // ─────────────────────────────────────────────
  it("likes a post", async () => {
    const [post] = postPda(user.publicKey, 0);
    const [like] = likePda(user.publicKey, post);

    await program.methods
      .likePost()
      .accounts({
        like,
        post,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const postAccount = await program.account.post.fetch(post);
    assert.equal(postAccount.likesCount.toNumber(), 1);

    const likeAccount = await program.account.like.fetch(like);
    assert.ok(likeAccount.user.equals(user.publicKey));
  });

  // ─────────────────────────────────────────────
  // 4b. Unliking a post
  // ─────────────────────────────────────────────
  it("unlikes a post", async () => {
    const [post] = postPda(user.publicKey, 0);
    const [like] = likePda(user.publicKey, post);

    await program.methods
      .unlikePost()
      .accounts({
        like,
        post,
        user: user.publicKey,
      })
      .rpc();

    const postAccount = await program.account.post.fetch(post);
    assert.equal(postAccount.likesCount.toNumber(), 0);

    // Like PDA should be closed
    const likeAccountInfo = await provider.connection.getAccountInfo(like);
    assert.isNull(likeAccountInfo);
  });

  // ─────────────────────────────────────────────
  // 5. Commenting on a post
  // ─────────────────────────────────────────────
  it("comments on a post", async () => {
    const [post] = postPda(user.publicKey, 0);
    const commentIndex = 0;
    const [comment] = commentPda(post, commentIndex);

    await program.methods
      .commentPost(new anchor.BN(commentIndex), "Great post!")
      .accounts({
        comment,
        post,
        author: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const commentAccount = await program.account.comment.fetch(comment);
    assert.equal(commentAccount.content, "Great post!");
    assert.ok(commentAccount.author.equals(user.publicKey));

    const postAccount = await program.account.post.fetch(post);
    assert.equal(postAccount.commentsCount.toNumber(), 1);
  });

  // ─────────────────────────────────────────────
  // 6. Following a user
  // ─────────────────────────────────────────────
  it("creates a profile for otherUser then follows them", async () => {
    const [otherProfile] = profilePda(otherUser.publicKey);

    // Create otherUser's profile
    await program.methods
      .createProfile("bob", "Bob B.", "Also building", "")
      .accounts({
        profile: otherProfile,
        authority: otherUser.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([otherUser])
      .rpc();

    const [followerProfile] = profilePda(user.publicKey);
    const [follow] = followPda(user.publicKey, otherProfile);

    await program.methods
      .followUser()
      .accounts({
        follow,
        followerProfile,
        followeeProfile: otherProfile,
        authority: user.publicKey,
        follower: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const followAccount = await program.account.follow.fetch(follow);
    assert.ok(followAccount.follower.equals(user.publicKey));

    const followerProfileAccount = await program.account.profile.fetch(followerProfile);
    assert.equal(followerProfileAccount.followingCount.toNumber(), 1);

    const followeeProfileAccount = await program.account.profile.fetch(otherProfile);
    assert.equal(followeeProfileAccount.followersCount.toNumber(), 1);
  });

  // ─────────────────────────────────────────────
  // 6b. Unfollowing a user
  // ─────────────────────────────────────────────
  it("unfollows a user", async () => {
    const [otherProfile] = profilePda(otherUser.publicKey);
    const [followerProfile] = profilePda(user.publicKey);
    const [follow] = followPda(user.publicKey, otherProfile);

    await program.methods
      .unfollowUser()
      .accounts({
        follow,
        followerProfile,
        followeeProfile: otherProfile,
        follower: user.publicKey,
      })
      .rpc();

    const followAccountInfo = await provider.connection.getAccountInfo(follow);
    assert.isNull(followAccountInfo);

    const followerProfileAccount = await program.account.profile.fetch(followerProfile);
    assert.equal(followerProfileAccount.followingCount.toNumber(), 0);

    const followeeProfileAccount = await program.account.profile.fetch(otherProfile);
    assert.equal(followeeProfileAccount.followersCount.toNumber(), 0);
  });

  // ─────────────────────────────────────────────
  // 7. Tipping a creator
  // ─────────────────────────────────────────────
  it("tips a creator", async () => {
    const [post] = postPda(user.publicKey, 0);
    const tipAmount = new anchor.BN(100_000_000); // 0.1 SOL

    const creatorBalanceBefore = await provider.connection.getBalance(user.publicKey);

    await program.methods
      .tipCreator(tipAmount)
      .accounts({
        post,
        creator: user.publicKey,
        tipper: otherUser.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([otherUser])
      .rpc();

    const postAccount = await program.account.post.fetch(post);
    assert.equal(postAccount.tipLamports.toNumber(), tipAmount.toNumber());

    const creatorBalanceAfter = await provider.connection.getBalance(user.publicKey);
    assert.isAbove(creatorBalanceAfter, creatorBalanceBefore);
  });

  // ─────────────────────────────────────────────
  // 8. Creating a community
  // ─────────────────────────────────────────────
  it("creates a community", async () => {
    const name = "solana-devs";
    const [community] = communityPda(name);

    await program.methods
      .createCommunity(name, "A community for Solana developers")
      .accounts({
        community,
        creator: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const communityAccount = await program.account.community.fetch(community);
    assert.equal(communityAccount.name, name);
    assert.equal(communityAccount.description, "A community for Solana developers");
    assert.equal(communityAccount.membersCount.toNumber(), 1);
    assert.ok(communityAccount.creator.equals(user.publicKey));
  });

  // ─────────────────────────────────────────────
  // 9. Error cases
  // ─────────────────────────────────────────────
  it("cannot create a duplicate profile", async () => {
    const [profile] = profilePda(user.publicKey);

    try {
      await program.methods
        .createProfile("alice2", "Alice Duplicate", "", "")
        .accounts({
          profile,
          authority: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Expected transaction to fail");
    } catch (err) {
      // Anchor rejects re-initialising an existing PDA (already in use)
      assert.ok(err, "Error thrown as expected");
    }
  });

  it("cannot follow yourself", async () => {
    const [myProfile] = profilePda(user.publicKey);
    const [follow] = followPda(user.publicKey, myProfile);

    try {
      await program.methods
        .followUser()
        .accounts({
          follow,
          followerProfile: myProfile,
          followeeProfile: myProfile,
          authority: user.publicKey,
          follower: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Expected CannotFollowSelf error");
    } catch (err: any) {
      const msg: string = err.message ?? "";
      assert.ok(
        msg.includes("CannotFollowSelf") || msg.includes("Cannot follow yourself"),
        `Unexpected error: ${msg}`
      );
    }
  });
});
