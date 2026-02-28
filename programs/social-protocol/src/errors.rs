use anchor_lang::prelude::*;

#[error_code]
pub enum SocialError {
    #[msg("Username already taken")]
    UsernameTaken,
    #[msg("Username too long")]
    UsernameTooLong,
    #[msg("Content too long")]
    ContentTooLong,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Profile already exists")]
    ProfileAlreadyExists,
    #[msg("Already following")]
    AlreadyFollowing,
    #[msg("Not following")]
    NotFollowing,
    #[msg("Already liked")]
    AlreadyLiked,
    #[msg("Not liked")]
    NotLiked,
    #[msg("Post deleted")]
    PostDeleted,
    #[msg("Invalid tip amount")]
    InvalidTipAmount,
    #[msg("Bio too long")]
    BioTooLong,
    #[msg("Cannot follow yourself")]
    CannotFollowSelf,
    #[msg("Community name too long")]
    CommunityNameTooLong,
    #[msg("Arithmetic overflow")]
    Overflow,
}
