use anchor_lang::prelude::*;
use crate::state::{Post, Profile};
use crate::errors::SocialError;

#[derive(Accounts)]
#[instruction(post_index: u64, content: String)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = author,
        space = Post::SPACE,
        seeds = [b"post", author.key().as_ref(), post_index.to_le_bytes().as_ref()],
        bump
    )]
    pub post: Account<'info, Post>,

    #[account(
        mut,
        seeds = [b"profile", author.key().as_ref()],
        bump = profile.bump,
        has_one = authority @ SocialError::Unauthorized,
    )]
    pub profile: Account<'info, Profile>,

    /// CHECK: The authority is validated via profile's has_one constraint
    pub authority: AccountInfo<'info>,

    #[account(mut)]
    pub author: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_post(
    ctx: Context<CreatePost>,
    post_index: u64,
    content: String,
    media_uri: String,
) -> Result<()> {
    require!(content.len() <= Post::MAX_CONTENT_LEN, SocialError::ContentTooLong);
    require!(media_uri.len() <= Post::MAX_MEDIA_URI_LEN, SocialError::ContentTooLong);
    require_eq!(post_index, ctx.accounts.profile.post_count, SocialError::Unauthorized);

    let post = &mut ctx.accounts.post;
    post.author = ctx.accounts.author.key();
    post.content = content;
    post.media_uri = media_uri;
    post.likes_count = 0;
    post.comments_count = 0;
    post.tip_lamports = 0;
    post.post_index = post_index;
    post.created_at = Clock::get()?.unix_timestamp;
    post.is_deleted = false;
    post.bump = ctx.bumps.post;

    ctx.accounts.profile.post_count = ctx.accounts.profile.post_count
        .checked_add(1)
        .ok_or(SocialError::Overflow)?;

    Ok(())
}
