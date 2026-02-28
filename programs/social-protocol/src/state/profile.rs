use anchor_lang::prelude::*;

#[account]
pub struct Profile {
    pub authority: Pubkey,
    pub username: String,
    pub display_name: String,
    pub bio: String,
    pub avatar_uri: String,
    pub followers_count: u64,
    pub following_count: u64,
    pub post_count: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl Profile {
    // 8 discriminator
    // 32 authority
    // 4 + 32 username
    // 4 + 64 display_name
    // 4 + 160 bio
    // 4 + 200 avatar_uri
    // 8 followers_count
    // 8 following_count
    // 8 post_count
    // 8 created_at
    // 1 bump
    pub const MAX_USERNAME_LEN: usize = 32;
    pub const MAX_DISPLAY_NAME_LEN: usize = 64;
    pub const MAX_BIO_LEN: usize = 160;
    pub const MAX_AVATAR_URI_LEN: usize = 200;

    pub const SPACE: usize = 8
        + 32
        + (4 + Self::MAX_USERNAME_LEN)
        + (4 + Self::MAX_DISPLAY_NAME_LEN)
        + (4 + Self::MAX_BIO_LEN)
        + (4 + Self::MAX_AVATAR_URI_LEN)
        + 8
        + 8
        + 8
        + 8
        + 1;
}
