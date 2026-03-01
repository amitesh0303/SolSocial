use anchor_lang::prelude::*;
use crate::state::{Comment, Post};
use crate::errors::SocialError;

#[derive(Accounts)]
#[instruction(comment_index: u64, content: String)]
pub struct CommentPost<'info> {
    #[account(
        init,
        payer = author,
        space = Comment::SPACE,
        seeds = [b"comment", post.key().as_ref(), comment_index.to_le_bytes().as_ref()],
        bump
    )]
    pub comment: Account<'info, Comment>,

    #[account(
        mut,
        constraint = !post.is_deleted @ SocialError::PostDeleted,
    )]
    pub post: Account<'info, Post>,

    #[account(mut)]
    pub author: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn comment_post(
    ctx: Context<CommentPost>,
    comment_index: u64,
    content: String,
) -> Result<()> {
    require!(content.len() <= Comment::MAX_CONTENT_LEN, SocialError::ContentTooLong);
    require_eq!(comment_index, ctx.accounts.post.comments_count, SocialError::Unauthorized);

    let comment = &mut ctx.accounts.comment;
    comment.author = ctx.accounts.author.key();
    comment.post = ctx.accounts.post.key();
    comment.content = content;
    comment.comment_index = comment_index;
    comment.created_at = Clock::get()?.unix_timestamp;
    comment.bump = ctx.bumps.comment;

    ctx.accounts.post.comments_count = ctx.accounts.post.comments_count
        .checked_add(1)
        .ok_or(SocialError::Overflow)?;

    Ok(())
}
