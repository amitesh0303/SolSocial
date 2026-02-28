use anchor_lang::prelude::*;
use crate::state::{Like, Post};
use crate::errors::SocialError;

#[derive(Accounts)]
pub struct UnlikePost<'info> {
    #[account(
        mut,
        seeds = [b"like", user.key().as_ref(), post.key().as_ref()],
        bump = like.bump,
        has_one = user @ SocialError::Unauthorized,
        close = user,
    )]
    pub like: Account<'info, Like>,

    #[account(mut)]
    pub post: Account<'info, Post>,

    #[account(mut)]
    pub user: Signer<'info>,
}

pub fn unlike_post(ctx: Context<UnlikePost>) -> Result<()> {
    ctx.accounts.post.likes_count = ctx.accounts.post.likes_count.saturating_sub(1);

    Ok(())
}
