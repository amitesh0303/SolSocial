use anchor_lang::prelude::*;
use crate::state::{Follow, Profile};
use crate::errors::SocialError;

#[derive(Accounts)]
pub struct UnfollowUser<'info> {
    #[account(
        mut,
        seeds = [b"follow", follower.key().as_ref(), followee_profile.key().as_ref()],
        bump = follow.bump,
        has_one = follower @ SocialError::Unauthorized,
        close = follower,
    )]
    pub follow: Account<'info, Follow>,

    #[account(
        mut,
        seeds = [b"profile", follower.key().as_ref()],
        bump = follower_profile.bump,
    )]
    pub follower_profile: Account<'info, Profile>,

    #[account(mut)]
    pub followee_profile: Account<'info, Profile>,

    #[account(mut)]
    pub follower: Signer<'info>,
}

pub fn unfollow_user(ctx: Context<UnfollowUser>) -> Result<()> {
    ctx.accounts.follower_profile.following_count = ctx
        .accounts
        .follower_profile
        .following_count
        .saturating_sub(1);

    ctx.accounts.followee_profile.followers_count = ctx
        .accounts
        .followee_profile
        .followers_count
        .saturating_sub(1);

    Ok(())
}
