use anchor_lang::prelude::*;
use crate::state::Profile;
use crate::errors::SocialError;

#[derive(Accounts)]
#[instruction(username: String)]
pub struct CreateProfile<'info> {
    #[account(
        init,
        payer = authority,
        space = Profile::SPACE,
        seeds = [b"profile", authority.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Profile>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_profile(
    ctx: Context<CreateProfile>,
    username: String,
    display_name: String,
    bio: String,
    avatar_uri: String,
) -> Result<()> {
    require!(username.len() <= Profile::MAX_USERNAME_LEN, SocialError::UsernameTooLong);
    require!(display_name.len() <= Profile::MAX_DISPLAY_NAME_LEN, SocialError::ContentTooLong);
    require!(bio.len() <= Profile::MAX_BIO_LEN, SocialError::BioTooLong);
    require!(avatar_uri.len() <= Profile::MAX_AVATAR_URI_LEN, SocialError::ContentTooLong);

    let profile = &mut ctx.accounts.profile;
    profile.authority = ctx.accounts.authority.key();
    profile.username = username;
    profile.display_name = display_name;
    profile.bio = bio;
    profile.avatar_uri = avatar_uri;
    profile.followers_count = 0;
    profile.following_count = 0;
    profile.post_count = 0;
    profile.created_at = Clock::get()?.unix_timestamp;
    profile.bump = ctx.bumps.profile;

    Ok(())
}
