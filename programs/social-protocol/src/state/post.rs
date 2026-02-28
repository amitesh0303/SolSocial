use anchor_lang::prelude::*;

#[account]
pub struct Post {
    pub author: Pubkey,
    pub content: String,
    pub media_uri: String,
    pub likes_count: u64,
    pub comments_count: u64,
    pub tip_lamports: u64,
    pub post_index: u64,
    pub created_at: i64,
    pub is_deleted: bool,
    pub bump: u8,
}

impl Post {
    pub const MAX_CONTENT_LEN: usize = 280;
    pub const MAX_MEDIA_URI_LEN: usize = 200;

    pub const SPACE: usize = 8
        + 32
        + (4 + Self::MAX_CONTENT_LEN)
        + (4 + Self::MAX_MEDIA_URI_LEN)
        + 8
        + 8
        + 8
        + 8
        + 8
        + 1
        + 1;
}
