use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;

declare_id!("12SJhuwYKD8Py4zN1c2jg5GfCBz5LqtuuhFRx75fWAyJ");

#[program]
pub mod social_protocol {
    use super::*;

    /// Creates a new user profile PDA derived from the authority's public key.
    pub fn create_profile(
        ctx: Context<CreateProfile>,
        username: String,
        display_name: String,
        bio: String,
        avatar_uri: String,
    ) -> Result<()> {
        instructions::create_profile::create_profile(ctx, username, display_name, bio, avatar_uri)
    }

    /// Updates mutable fields on an existing profile (authority only).
    pub fn update_profile(
        ctx: Context<UpdateProfile>,
        display_name: String,
        bio: String,
        avatar_uri: String,
    ) -> Result<()> {
        instructions::update_profile::update_profile(ctx, display_name, bio, avatar_uri)
    }

    /// Creates a new post. `post_index` must equal the author's current `post_count`.
    pub fn create_post(
        ctx: Context<CreatePost>,
        post_index: u64,
        content: String,
        media_uri: String,
    ) -> Result<()> {
        instructions::create_post::create_post(ctx, post_index, content, media_uri)
    }

    /// Marks a post as deleted and closes the account, returning rent to the author.
    pub fn delete_post(ctx: Context<DeletePost>) -> Result<()> {
        instructions::delete_post::delete_post(ctx)
    }

    /// Likes a post, creating a Like PDA. Fails if already liked.
    pub fn like_post(ctx: Context<LikePost>) -> Result<()> {
        instructions::like_post::like_post(ctx)
    }

    /// Removes a like from a post, closing the Like PDA.
    pub fn unlike_post(ctx: Context<UnlikePost>) -> Result<()> {
        instructions::unlike_post::unlike_post(ctx)
    }

    /// Adds a comment to a post. `comment_index` must equal the post's current `comments_count`.
    pub fn comment_post(
        ctx: Context<CommentPost>,
        comment_index: u64,
        content: String,
    ) -> Result<()> {
        instructions::comment_post::comment_post(ctx, comment_index, content)
    }

    /// Creates a Follow PDA and increments both follower/followee counters.
    pub fn follow_user(ctx: Context<FollowUser>) -> Result<()> {
        instructions::follow_user::follow_user(ctx)
    }

    /// Closes a Follow PDA and decrements both follower/followee counters.
    pub fn unfollow_user(ctx: Context<UnfollowUser>) -> Result<()> {
        instructions::unfollow_user::unfollow_user(ctx)
    }

    /// Transfers SOL from tipper to creator and emits a TipEvent.
    pub fn tip_creator(ctx: Context<TipCreator>, amount: u64) -> Result<()> {
        instructions::tip_creator::tip_creator(ctx, amount)
    }

    /// Creates a new Community PDA derived from the community name.
    pub fn create_community(
        ctx: Context<CreateCommunity>,
        name: String,
        description: String,
    ) -> Result<()> {
        instructions::create_community::create_community(ctx, name, description)
    }
}
