use anchor_lang::prelude::*;

#[account]
pub struct Comment {
    pub author: Pubkey,
    pub post: Pubkey,
    pub content: String,
    pub comment_index: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl Comment {
    pub const MAX_CONTENT_LEN: usize = 280;

    pub const SPACE: usize = 8
        + 32
        + 32
        + (4 + Self::MAX_CONTENT_LEN)
        + 8
        + 8
        + 1;
}
