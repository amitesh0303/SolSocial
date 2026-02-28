use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::{Post, TipEvent};
use crate::errors::SocialError;

#[derive(Accounts)]
pub struct TipCreator<'info> {
    #[account(
        mut,
        constraint = !post.is_deleted @ SocialError::PostDeleted,
    )]
    pub post: Account<'info, Post>,

    /// CHECK: This is the creator's wallet that receives the tip
    #[account(
        mut,
        constraint = creator.key() == post.author @ SocialError::Unauthorized,
    )]
    pub creator: AccountInfo<'info>,

    #[account(mut)]
    pub tipper: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn tip_creator(ctx: Context<TipCreator>, amount: u64) -> Result<()> {
    require!(amount > 0, SocialError::InvalidTipAmount);

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.tipper.to_account_info(),
            to: ctx.accounts.creator.to_account_info(),
        },
    );
    system_program::transfer(cpi_ctx, amount)?;

    ctx.accounts.post.tip_lamports = ctx.accounts.post.tip_lamports
        .checked_add(amount)
        .ok_or(SocialError::Overflow)?;

    emit!(TipEvent {
        from: ctx.accounts.tipper.key(),
        to: ctx.accounts.creator.key(),
        amount,
        mint: None,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
