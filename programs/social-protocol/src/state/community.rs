use anchor_lang::prelude::*;

#[account]
pub struct Community {
    pub creator: Pubkey,
    pub name: String,
    pub description: String,
    pub members_count: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl Community {
    pub const MAX_NAME_LEN: usize = 64;
    pub const MAX_DESCRIPTION_LEN: usize = 200;

    pub const SPACE: usize = 8
        + 32
        + (4 + Self::MAX_NAME_LEN)
        + (4 + Self::MAX_DESCRIPTION_LEN)
        + 8
        + 8
        + 1;
}
