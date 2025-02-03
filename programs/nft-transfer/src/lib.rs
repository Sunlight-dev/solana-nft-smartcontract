#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod instructions;

use instructions::*;

declare_id!("xG89jK6siAkcpVPbUnB9ExpYGFw196FocZRTBhpPbKC");

#[program]
pub mod nft_transfer {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        nft_name: String,
        nft_symbol: String,
        nft_uri: String,
    ) -> Result<()> {
        create::create_token(ctx, nft_name, nft_symbol, nft_uri)
    }

    pub fn mint_token(ctx: Context<MintToken>) -> Result<()> {
        mint::mint_token(ctx)
    }

    pub fn transfer_tokens(ctx: Context<TransferTokens>) -> Result<()> {
        transfer::transfer_tokens(ctx)
    }
}
