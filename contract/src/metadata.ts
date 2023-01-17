import { Bytes } from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";

export type TokenId = string;
export type Option<T> = T | null;

export class NFTContractMetadata {
  spec: string; // required, essentially a version like "nft-2.0.0", replacing "2.0.0" with the implemented version of NEP-177
  name: string; // required, ex. "Mochi Rising — Digital Edition" or "Metaverse 3"
  symbol: string; // required, ex. "MOCHI"
  icon?: string;
  base_uri?: string;
  reference?: string;
  reference_hash?: Bytes;
  constructor({
    spec,
    name,
    symbol,
    icon,
    base_uri,
    reference,
    reference_hash,
  }: {
    spec: string;
    name: string;
    symbol: string;
    icon?: string;
    base_uri?: string;
    reference?: string;
    reference_hash?: Bytes;
  }) {
    this.spec = spec;
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.base_uri = base_uri;
    this.reference = reference;
    this.reference_hash = reference_hash;
  }
}

export class TokenMetadata {
  title?: string; // ex. "Arch Nemesis?: Mail Carrier" or "Parcel #5055"
  description?: string; // free-form description
  media?: string; // URL to associated media, preferably to decentralized, content-addressed storage
  media_hash?: string; // Base64-encoded sha256 hash of content referenced by the `media` field. Required if `media` is included.
  copies?: number; // number of copies of this set of metadata in existence when token was minted.
  issued_at?: number; // When token was issued or minted, Unix epoch in milliseconds
  expires_at?: number; // When token expires, Unix epoch in milliseconds
  starts_at?: number; // When token starts being valid, Unix epoch in milliseconds
  updated_at?: number; // When token was last updated, Unix epoch in milliseconds
  extra?: string; // anything extra the NFT wants to store on-chain. Can be stringified JSON.
  reference?: string; // URL to an off-chain JSON file with more info.
  reference_hash?: string; // Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.

  constructor({
    title,
    description,
    media,
    media_hash,
    copies,
    issued_at,
    expires_at,
    starts_at,
    updated_at,
    extra,
    reference,
    reference_hash,
  }: {
    title: string;
    description: string;
    media: string;
    media_hash: string;
    copies: number;
    issued_at: number;
    expires_at: number;
    starts_at: number;
    updated_at: number;
    extra: string;
    reference: string;
    reference_hash: string;
  }) {
    this.title = title;
    this.description = description;
    this.media = media;
    this.media_hash = media_hash;
    this.copies = copies;
    this.issued_at = issued_at;
    this.expires_at = expires_at;
    this.starts_at = starts_at;
    this.updated_at = updated_at;
    this.extra = extra;
    this.reference = reference;
    this.reference_hash = reference_hash;
  }
}

export class JsonToken {
  token_id: TokenId;
  owner_id: AccountId;
  metadata: TokenMetadata;
  constructor({
    token_id,
    owner_id,
    metadata,
  }: {
    token_id: TokenId;
    owner_id: AccountId;
    metadata: TokenMetadata;
  }) {
    this.token_id = token_id;
    this.owner_id = owner_id;
    this.metadata = metadata;
  }
}

export class Token {
  owner_id: AccountId;

  constructor({ owner_id }: { owner_id: AccountId }) {
    this.owner_id = owner_id;
  }
}

//logic ghost hamster trim wrist camp private ignore february ecology lawsuit oak
