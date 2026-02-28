use anchor_lang::prelude::*;

#[event]
pub struct TipEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub mint: Option<Pubkey>,
    pub timestamp: i64,
}
