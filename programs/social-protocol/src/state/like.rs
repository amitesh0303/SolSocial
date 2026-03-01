use anchor_lang::prelude::*;

#[account]
pub struct Like {
    pub user: Pubkey,
    pub post: Pubkey,
    pub created_at: i64,
    pub bump: u8,
}

impl Like {
    pub const SPACE: usize = 8 + 32 + 32 + 8 + 1;
}
