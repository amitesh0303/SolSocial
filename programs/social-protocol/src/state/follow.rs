use anchor_lang::prelude::*;

#[account]
pub struct Follow {
    pub follower: Pubkey,
    pub followee: Pubkey,
    pub created_at: i64,
    pub bump: u8,
}

impl Follow {
    pub const SPACE: usize = 8 + 32 + 32 + 8 + 1;
}
