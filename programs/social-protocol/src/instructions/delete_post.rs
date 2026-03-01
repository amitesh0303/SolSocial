use anchor_lang::prelude::*;
use crate::state::Post;
use crate::errors::SocialError;

#[derive(Accounts)]
pub struct DeletePost<'info> {
    #[account(
        mut,
        seeds = [b"post", author.key().as_ref(), post.post_index.to_le_bytes().as_ref()],
        bump = post.bump,
        has_one = author @ SocialError::Unauthorized,
        close = author,
    )]
    pub post: Account<'info, Post>,

    #[account(mut)]
    pub author: Signer<'info>,
}

pub fn delete_post(ctx: Context<DeletePost>) -> Result<()> {
    require!(!ctx.accounts.post.is_deleted, SocialError::PostDeleted);

    ctx.accounts.post.is_deleted = true;

    Ok(())
}
