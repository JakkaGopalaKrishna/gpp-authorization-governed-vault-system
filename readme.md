1. Generate authorization off-chain:
   hash(chainId, vault, recipient, amount, nonce)
2. Sign with authorizer private key
3. Call vault.withdraw(...)
4. AuthorizationManager verifies & consumes
5. Vault transfers ETH
