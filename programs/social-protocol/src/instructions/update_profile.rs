use anchor_lang::prelude::*;
use crate::state::Profile;
use crate::errors::SocialError;

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(
        mut,
        seeds = [b"profile", authority.key().as_ref()],
        bump = profile.bump,
        has_one = authority @ SocialError::Unauthorized,
    )]
    pub profile: Account<'info, Profile>,

    pub authority: Signer<'info>,
}

pub fn update_profile(
    ctx: Context<UpdateProfile>,
    display_name: String,
    bio: String,
    avatar_uri: String,
) -> Result<()> {
    require!(display_name.len() <= Profile::MAX_DISPLAY_NAME_LEN, SocialError::ContentTooLong);
    require!(bio.len() <= Profile::MAX_BIO_LEN, SocialError::BioTooLong);
    require!(avatar_uri.len() <= Profile::MAX_AVATAR_URI_LEN, SocialError::ContentTooLong);

    let profile = &mut ctx.accounts.profile;
    profile.display_name = display_name;
    profile.bio = bio;
    profile.avatar_uri = avatar_uri;

    Ok(())
}
