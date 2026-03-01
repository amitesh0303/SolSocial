use anchor_lang::prelude::*;
use crate::state::Community;
use crate::errors::SocialError;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateCommunity<'info> {
    #[account(
        init,
        payer = creator,
        space = Community::SPACE,
        seeds = [b"community", name.as_bytes()],
        bump
    )]
    pub community: Account<'info, Community>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_community(
    ctx: Context<CreateCommunity>,
    name: String,
    description: String,
) -> Result<()> {
    require!(name.len() <= Community::MAX_NAME_LEN, SocialError::CommunityNameTooLong);
    require!(description.len() <= Community::MAX_DESCRIPTION_LEN, SocialError::ContentTooLong);

    let community = &mut ctx.accounts.community;
    community.creator = ctx.accounts.creator.key();
    community.name = name;
    community.description = description;
    community.members_count = 1;
    community.created_at = Clock::get()?.unix_timestamp;
    community.bump = ctx.bumps.community;

    Ok(())
}
