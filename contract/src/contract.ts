import {
  NearBindgen,
  near,
  call,
  view,
  initialize,
  LookupMap,
  UnorderedMap,
  assert,
  UnorderedSet,
} from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";
import {
  JsonToken,
  NFTContractMetadata,
  Option,
  Token,
  TokenId,
  TokenMetadata,
} from "./metadata";
import { check_owner } from "./utils";

@NearBindgen({})
export class Contract {
  owner_id: AccountId;
  tokens_per_owner: LookupMap = new LookupMap("tokens_per_owner"); //{owner_id, token_id}
  token_by_id: LookupMap = new LookupMap("token_by_id"); // {token_id, JsonToken}
  token_metadata_by_id: UnorderedMap = new UnorderedMap("token_metadata_by_i"); // {token_id, TokenMetadata}
  metadata: NFTContractMetadata = new NFTContractMetadata({
    spec: "nft-1.0.0",
    name: "NFT Marketplace K10",
    symbol: "NFTK10",
  });

  @initialize({})
  init({ owner_id }: { owner_id: AccountId }) {
    this.owner_id = owner_id;
  }

  @call({ payableFunction: true })
  nft_mint({
    token_id,
    receiver_id,
    metadata,
  }: {
    token_id: TokenId;
    receiver_id: AccountId;
    metadata: TokenMetadata;
  }) {
    // TOKEN - Onwer id
    let token = new Token({
      owner_id: receiver_id,
    });

    assert(!this.token_by_id.containsKey(token_id), "Token Already Exists");

    // add token to owner
    this.token_by_id.set(token_id, token);

    // JsonTOken[] of owner
    let tokens_owner = check_owner(this.tokens_per_owner.get(receiver_id));
    if (tokens_owner == null) {
      tokens_owner = new UnorderedSet("tokens_per_owner" + receiver_id);
    }

    tokens_owner.set(token_id);

    // insert tokens per onwer token_owner = JsonToken []
    this.tokens_per_owner.set(receiver_id, tokens_owner);

    // insert token metadata
    this.token_metadata_by_id.set(token_id, metadata);

    let nft_mint_events = {
      standard: "nep171",
      version: "nft-1.0.0",
      event: "nft_mint",
      data: [{ owner_id: token.owner_id, token_ids: [token_id] }],
    };

    near.log(`EVENT_LOG:${JSON.stringify(nft_mint_events)}`);
  }

  @view({})
  nft_total_supply(): number {
    return this.token_metadata_by_id.length;
  }

  @view({})
  nft_supply_for_owner({ owner_id }: { owner_id: AccountId }): number {
    let tokens = check_owner(this.tokens_per_owner.get(owner_id));
    if (tokens == null) {
      return 0;
    }
    return tokens.length;
  }

  @view({})
  nft_token({ token_id }: { token_id: TokenId }): JsonToken {
    let token = this.token_by_id.get(token_id) as JsonToken;

    if (token == null) {
      return null;
    }

    let metadata = this.token_metadata_by_id.get(
      token_id
    ) as NFTContractMetadata;

    return new JsonToken({
      token_id,
      owner_id: token.owner_id,
      metadata,
    });
  }

  @view({})
  nft_tokens({
    from_start,
    limit,
  }: {
    from_start?: number | null;
    limit?: number | null;
  }): JsonToken[] {
    let tokens = [];
    let start = from_start ? from_start : 0;
    let max = limit ? limit : 20;
    let keys = this.token_metadata_by_id.toArray();
    for (let i = start; i < start + max && i < keys.length; i++) {
      let token = this.nft_token({ token_id: keys[i][0] });
      tokens.push(token);
    }
    return tokens;
  }

  @view({})
  nft_tokens_for_owner({
    owner_id,
    from_start,
    limit,
  }: {
    owner_id: AccountId;
    from_start?: number | null;
    limit?: number | null;
  }): JsonToken[] {
    let tokens = [];
    let start = from_start ? from_start : 0;
    let max = limit ? limit : 20;
    let check_token = check_owner(this.tokens_per_owner.get(owner_id));
    if (check_token == null) return [];
    let keys = check_token.toArray();

    for (let i = start; i < max; i++) {
      if (i >= keys.length) {
        break;
      }

      let token = this.nft_token({ token_id: keys[i] });
      tokens.push(token);
    }
    return tokens;
  }

  @call({ payableFunction: true })
  nft_transfer({
    receiver_id,
    token_id,
    approval_id,
    memo,
  }: {
    receiver_id: AccountId;
    token_id: TokenId;
    approval_id: AccountId;
    memo: Option<string>;
  }) {}

  @call({ privateFunction: true })
  nft_transfer_call({
    receiver_id,
    token_id,
    msg,
    approval_id,
    memo,
  }: {
    receiver_id: AccountId;
    token_id: TokenId;
    msg: string;
    approval_id: AccountId;
    memo: Option<string>;
  }) {}

  @view({})
  nft_metadata(): NFTContractMetadata {
    return this.metadata;
  }
}
