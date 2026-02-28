use anchor_lang::prelude::*;
use crate::state::{Like, Post};
use crate::errors::SocialError;

#[derive(Accounts)]
pub struct LikePost<'info> {
    #[account(
        init,
        payer = user,
        space = Like::SPACE,
        seeds = [b"like", user.key().as_ref(), post.key().as_ref()],
        bump
    )]
    pub like: Account<'info, Like>,

    #[account(
        mut,
        constraint = !post.is_deleted @ SocialError::PostDeleted,
    )]
    pub post: Account<'info, Post>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn like_post(ctx: Context<LikePost>) -> Result<()> {
    let like = &mut ctx.accounts.like;
    like.user = ctx.accounts.user.key();
    like.post = ctx.accounts.post.key();
    like.created_at = Clock::get()?.unix_timestamp;
    like.bump = ctx.bumps.like;

    ctx.accounts.post.likes_count = ctx.accounts.post.likes_count
        .checked_add(1)
        .ok_or(SocialError::Overflow)?;

    Ok(())
}
