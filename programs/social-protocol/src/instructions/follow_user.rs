use anchor_lang::prelude::*;
use crate::state::{Follow, Profile};
use crate::errors::SocialError;

#[derive(Accounts)]
pub struct FollowUser<'info> {
    #[account(
        init,
        payer = follower,
        space = Follow::SPACE,
        seeds = [b"follow", follower.key().as_ref(), followee_profile.key().as_ref()],
        bump
    )]
    pub follow: Account<'info, Follow>,

    #[account(
        mut,
        seeds = [b"profile", follower.key().as_ref()],
        bump = follower_profile.bump,
        has_one = authority @ SocialError::Unauthorized,
    )]
    pub follower_profile: Account<'info, Profile>,

    #[account(mut)]
    pub followee_profile: Account<'info, Profile>,

    /// CHECK: The authority is validated via follower_profile's has_one constraint
    pub authority: AccountInfo<'info>,

    #[account(mut)]
    pub follower: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn follow_user(ctx: Context<FollowUser>) -> Result<()> {
    require!(
        ctx.accounts.follower.key() != ctx.accounts.followee_profile.authority,
        SocialError::CannotFollowSelf
    );

    let follow = &mut ctx.accounts.follow;
    follow.follower = ctx.accounts.follower.key();
    follow.followee = ctx.accounts.followee_profile.authority;
    follow.created_at = Clock::get()?.unix_timestamp;
    follow.bump = ctx.bumps.follow;

    ctx.accounts.follower_profile.following_count = ctx
        .accounts
        .follower_profile
        .following_count
        .checked_add(1)
        .ok_or(SocialError::Overflow)?;

    ctx.accounts.followee_profile.followers_count = ctx
        .accounts
        .followee_profile
        .followers_count
        .checked_add(1)
        .ok_or(SocialError::Overflow)?;

    Ok(())
}
