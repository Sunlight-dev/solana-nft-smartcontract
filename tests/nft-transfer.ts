import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftTransfer } from "../target/types/nft_transfer";
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Keypair, PublicKey } from '@solana/web3.js';


describe("nft-transfer", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.NftTransfer as Program<NftTransfer>;

  const metadata = {
    name: '14RIG NFT',
    symbol: 'RIG',
    uri: 'https://gateway.pinata.cloud/ipfs/QmZVfpSTTYhPCZK6i59zvw7LZ9RA6opks1ooMJDpZCW1ig',
  };

  // Generate new keypair to use as address for mint account.
  const mintKeypair = new Keypair();

  // Generate new keypair to use as address for recipient wallet.
  const recipient = new PublicKey("6Nok1SdT8Dvtnn8r3BasYcAzxAWEmKhueEqMQNCD2Fh8");

  // Derive the associated token address account for the mint and payer.
  const senderTokenAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer.publicKey);

  // Derive the associated token address account for the mint and recipient.
  const recepientTokenAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, recipient);

  it('Create an NFT Token!', async () => {
    const transactionSignature = await program.methods
      .createToken(metadata.name, metadata.symbol, metadata.uri)
      .accounts({
        payer: payer.publicKey,
        mintAccount: mintKeypair.publicKey,
      })
      .signers([mintKeypair])
      .rpc();

    console.log('Success!');
    console.log(`   Mint Address: ${mintKeypair.publicKey}`);
    console.log(`   Transaction Signature: ${transactionSignature}`);
  });

  it('Mint tokens!', async () => {
    // Mint the tokens to the associated token account.
    const transactionSignature = await program.methods
      .mintToken()
      .accounts({
        mintAuthority: payer.publicKey,
        recipient: payer.publicKey,
        mintAccount: mintKeypair.publicKey,
        associatedTokenAccount: senderTokenAddress,
      })
      .rpc();

    console.log('Success!');
    console.log(`   Associated Token Account Address: ${senderTokenAddress}`);
    console.log(`   Transaction Signature: ${transactionSignature}`);
  });

  it('Transfer tokens!', async () => {
    const transactionSignature = await program.methods
      .transferTokens()
      .accounts({
        sender: payer.publicKey,
        recipient: recipient,
        mintAccount: mintKeypair.publicKey,
        senderTokenAccount: senderTokenAddress,
        recipientTokenAccount: recepientTokenAddress,
      })
      .rpc();

    console.log('Success!');
    console.log(`   Transaction Signature: ${transactionSignature}`);
  });
});
