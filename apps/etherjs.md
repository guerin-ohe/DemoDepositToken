> Signature transaction avec Ether.js

Signer une transaction vers un smart contract EVM sert à **prouver que l’adresse émettrice autorise l’opération**. La signature est produite avec la clé privée du compte, mais la clé privée elle-même n’est jamais transmise au réseau.

## Pourquoi est-ce nécessaire ?

Une transaction qui modifie l’état de la blockchain — par exemple `transfer`, `approve`, `mint`, `swap` ou `setValue` — doit être autorisée par une adresse. La signature permet aux nœuds de vérifier :

- que la transaction provient bien de l’adresse indiquée ;
- qu’elle n’a pas été modifiée ;
- que le nonce est correct et empêche la réutilisation de la transaction ;
- que l’émetteur accepte de payer le gas ;
- que l’adresse appelante (`msg.sender`) est authentifiée par l’EVM.

Avec ethers.js, un `Provider` suffit pour lire la blockchain, mais une opération d’écriture nécessite un `Signer` associé au contrat.[1][4]

## Lecture versus écriture

```ts
const provider = new ethers.JsonRpcProvider(RPC_URL);

const contract = new ethers.Contract(address, abi, provider);

// Lecture : aucune signature, aucun gas
const balance = await contract.balanceOf(userAddress);
```

En revanche :

```ts
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(address, abi, wallet);

// Écriture : signature + transaction on-chain + gas
const tx = await contract.transfer(recipient, amount);
await tx.wait();
```

Une fonction Solidity `view` ou `pure` peut généralement être exécutée localement par un nœud RPC. Elle ne modifie pas l’état et ne nécessite donc ni signature ni paiement de gas. Une fonction qui modifie l’état doit être incluse dans une transaction signée et validée par le réseau.[1]

## Que signe concrètement ethers.js ?

Pour appeler une fonction, ethers.js encode notamment :

```text
to       : adresse du contrat
data     : selector de fonction + arguments ABI encodés
value    : Ether éventuellement envoyé
nonce    : compteur de transactions du compte
gasLimit : limite de gas
chainId  : identifiant de la chaîne
```

Le `Signer` signe cette transaction avec la clé privée. La transaction signée peut ensuite être diffusée au réseau, généralement via `eth_sendRawTransaction`. Le contrat reçoit alors les données encodées et peut exécuter son code.

La signature ne signifie pas que le smart contract « signe » lui-même l’opération : c’est le compte externe — ou parfois un compte contrôlé par un autre mécanisme — qui autorise la transaction.

## Pourquoi le contrat a-t-il besoin de cette identité ?

Le contrat peut utiliser :

```solidity
msg.sender
```

pour identifier l’adresse qui appelle la fonction. C’est essentiel pour vérifier les permissions :

```solidity
function withdraw(uint256 amount) external {
   require(msg.sender == owner, "Not authorized");
   // ...
}
```

Sans signature valide, n’importe qui pourrait théoriquement fabriquer une requête prétendant venir de `owner`.

## Cas particulier : signature sans transaction

Il faut distinguer deux concepts :

- **Signature d’une transaction** : elle est diffusée au réseau, exécute du code et coûte du gas.
- **Signature d’un message ou de données EIP-712** : elle peut être vérifiée par un contrat ou une application, mais n’est pas nécessairement diffusée directement ni payée par le signataire.

Par exemple, un utilisateur peut signer une autorisation EIP-712 hors chaîne ; un relayer peut ensuite soumettre la transaction et payer le gas. Le contrat vérifie alors la signature pour déterminer si l’utilisateur a effectivement approuvé l’action. Ethers.js fournit des fonctions adaptées à ces signatures de données.[3][4]

En résumé, on signe une transaction EVM pour **authentifier l’émetteur, autoriser la modification de l’état et engager le paiement du gas**. Aucune signature n’est nécessaire pour une simple lecture, mais toute écriture classique doit être signée par un `Signer`.

Sources
[1] Contract https://docs.ethers.org/v5/api/contract/contract/
[2] xCall dapps on EVM chains https://docs.icon.community/cross-chain-communication/general-message-passing-xcall/guides/interacting-with-xcall-dapps-on-evm-chains
[3] Understanding the Signing Process of Solidity ... https://dev.to/fassko/understanding-the-signing-process-of-solidity-transactions-with-ethersjs-4a2n
[4] Single Page - Ethers.js https://docs.ethers.org/v6/single-page/
[5] Ethers.js Developer Guide – Practical https://dev.to/loading_blocks/ethersjs-developer-guide-practical-ocd
[6] Sending transactions | Immutable Documentation https://docs.immutable.com/products/zkevm/passport/wallet/transactions/
[7] Using ethersjsv6 to send signed raw transactions | by Victor Yeo https://victoryeo-62924.medium.com/using-ethersjsv6-to-send-signed-raw-transactions-99866a5b4054
[8] llms-full.txt - Para Docs https://docs.getpara.com/llms-full.txt
[9] Getting Started with ethers: Sending Transactions and Deploying ... https://forum.conflux.fun/t/getting-started-with-ethers-sending-transactions-and-deploying-smart-contracts/21410
[10] Integrate Embedded Wallets with the Ethereum Blockchain ... https://docs.metamask.io/embedded-wallets/connect-blockchain/evm/ethereum/javascript/

> coding v5

Oui — voici l’idée clé : pour appeler `transfer` sur un ERC20 avec ethers.js, il faut une **instance de contrat connectée à un signer** pour envoyer la transaction, alors qu’avec seulement un provider tu peux surtout lire l’état ou faire un test “à blanc” avec `callStatic`.[2][6]

## Sans signature

Avec un simple `provider`, le contrat est en lecture seule. Tu peux préparer ou simuler l’appel, mais tu ne peux pas signer et envoyer un transfert réel, car `transfer` modifie l’état on-chain et nécessite un compte capable de payer le gas.[4][6]

```ts
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const tokenAddress = "0xTokenAddress";
const abi = [
 "function transfer(address recipient, uint256 amount) external returns (bool)",
];

const token = new ethers.Contract(tokenAddress, abi, provider);

// Simulation seulement, pas de transaction envoyée
const ok = await token.callStatic.transfer(
 "0xRecipientAddress",
 ethers.parseUnits("1.0", 18)
);
```

Ici, `callStatic.transfer(...)` exécute une simulation locale de la fonction et retourne le résultat attendu sans créer de transaction réelle.[6]

## Avec signature

Dès que tu relies le contrat à un `signer` — par exemple un `Wallet` ou un `JsonRpcSigner` — l’appel `transfer` envoie une vraie transaction signée. C’est cette version qui débloque le transfert effectif de tokens.[7][6]

```ts
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const tokenAddress = "0xTokenAddress";
const abi = [
 "function transfer(address recipient, uint256 amount) external returns (bool)",
];

const token = new ethers.Contract(tokenAddress, abi, wallet);

const tx = await token.transfer(
 "0xRecipientAddress",
 ethers.parseUnits("1.0", 18)
);

await tx.wait();
```

Dans ce cas, `transfer` renvoie d’abord une `TransactionResponse`, puis `wait()` confirme l’inclusion du transfert.[2][6]

## Différence pratique

| Aspect | Sans signature | Avec signature |
|---|---|---|
| Objet connecté | `provider` | `signer` |
| Type d’appel | Lecture / simulation | Transaction réelle |
| Effet on-chain | Aucun | Oui |
| Signature requise | Non | Oui |
| Gas payé | Non | Oui |

Le point important est que `transfer` d’un ERC20 n’est pas un simple appel de lecture : c’est une opération d’écriture qui déplace des tokens depuis le compte du signataire vers le destinataire.[4][6]

## Version condensée

Si tu veux juste retenir une règle :

- `new Contract(address, abi, provider)` = lecture et simulation.
- `new Contract(address, abi, signer)` = transfert réel.[6]

## Exemple minimal

```ts
// lecture/simulation
const readOnly = new ethers.Contract(tokenAddress, abi, provider);
await readOnly.callStatic.transfer(to, amount);

// transfert réel
const writable = new ethers.Contract(tokenAddress, abi, wallet);
await writable.transfer(to, amount);
```

Si tu veux, je peux aussi te donner la même chose en **ethers v6 strictement typé TypeScript**, avec une version `ERC20__factory`/TypeChain.

Sources
[1] Appeler un contrat intelligent depuis JavaScript https://ethereum.org/fr/developers/tutorials/calling-a-smart-contract-from-javascript/
[2] Ethers.js: How to send ERC-20 Tokens https://support.metamask.io/fr/develop/building-with-infura/javascript-typescript/how-to-send-erc20-tokens-ethersjs/
[3] How do I call transfer on an ERC20 contract? (missing ... https://github.com/ethers-io/ethers.js/issues/136
[4] Présentation du contrat ERC-20 https://ethereum.org/fr/developers/tutorials/erc20-annotated-code/
[5] How do I transfer ERC20 tokens using Ether.js? https://stackoverflow.com/questions/71759637/how-do-i-transfer-erc20-tokens-using-ether-js
[6] Example: ERC-20 Contract https://docs.ethers.org/v5/api/contract/example/
[7] Listing and transferring ERC20 tokens · Issue #183 · ethers-io/ethers.js https://github.com/ethers-io/ethers.js/issues/183
[8] typechain/ethers-v6 https://www.npmjs.com/package/@typechain/ethers-v6
[9] Envoyer des jetons avec ethers.js https://ethereum.org/fr/developers/tutorials/send-token-ethersjs/
[10] Transferts et approbation des jetons ERC-20 à partir d'un contrat intelligent de solidity https://ethereum.org/fr/developers/tutorials/transfers-and-approval-of-erc-20-tokens-from-a-solidity-smart-contract/

> coding v6

Oui — voici une version **ethers v6 + TypeScript** avec typing strict, et la différence entre `transfer` sans signature et avec signature. Le principe reste le même : sans `signer`, tu ne peux pas envoyer une transaction d’écriture ; avec `signer`, tu peux.[1][2]

## Version TypeScript simple

```ts
import { Contract, JsonRpcProvider, Wallet, parseUnits } from "ethers";

const abi = [
 "function transfer(address to, uint256 amount) returns (bool)",
 "function balanceOf(address account) view returns (uint256)",
] as const;

const tokenAddress = "0xTokenAddress";
const to = "0xRecipientAddress";

const provider = new JsonRpcProvider(process.env.RPC_URL);

// Lecture / simulation
const tokenRead = new Contract(tokenAddress, abi, provider);

// Envoi réel
const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
const tokenWrite = new Contract(tokenAddress, abi, wallet);

const amount = parseUnits("1.0", 18);

// Sans signature : simulation uniquement
const simulated = await tokenRead.transfer.staticCall(to, amount);

// Avec signature : transaction réelle
const tx = await tokenWrite.transfer(to, amount);
await tx.wait();
```

En ethers v6, `staticCall` sert à simuler l’appel, tandis que l’objet connecté au `Wallet` envoie bien une transaction signée.[2][1]

## Lecture vs écriture

| Cas | Code | Résultat |
|---|---|---|
| Sans signature | `new Contract(address, abi, provider)` | Lecture et simulation seulement |
| Avec signature | `new Contract(address, abi, wallet)` | Transaction `transfer` envoyée |
| Simulation | `contract.transfer.staticCall(...)` | Retourne le résultat attendu sans écrire |
| Envoi | `contract.transfer(...)` | Crée une transaction on-chain |

La fonction `transfer` d’un ERC20 est une opération d’écriture qui déplace des tokens depuis le compte du signataire vers le destinataire.[1][2]

## Version TypeChain

Si tu génères les types avec TypeChain, tu obtiens une API plus sûre et plus pratique pour un ERC20. Le target `@typechain/ethers-v6` fournit des wrappers typés autour des contrats ethers v6.[3][4]

```ts
import { JsonRpcProvider, Wallet, parseUnits } from "ethers";
import { ERC20__factory } from "./typechain";

const provider = new JsonRpcProvider(process.env.RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);

const tokenRead = ERC20__factory.connect("0xTokenAddress", provider);
const tokenWrite = ERC20__factory.connect("0xTokenAddress", wallet);

const amount = parseUnits("1.0", 18);

// Simulation
await tokenRead.transfer.staticCall("0xRecipientAddress", amount);

// Transaction réelle
const tx = await tokenWrite.transfer("0xRecipientAddress", amount);
await tx.wait();
```

TypeChain génère des méthodes typées, des événements typés, et des helpers comme `staticCall`, `send`, et `estimateGas` autour du contrat.[4][3]

## Ce qu’il faut retenir

- `provider` seul = pas de signature, donc pas d’envoi réel.[2][1]
- `wallet` ou autre `signer` = signature possible, donc `transfer` on-chain.[5][1]
- `staticCall` = test préalable utile pour vérifier que le transfert passerait.[1][2]

Je peux aussi te donner une version prête à copier pour un projet Node.js avec `tsconfig`, ABI d’OpenZeppelin, et un exemple `approve + transferFrom`.

Sources
[1] Ethers getting started docs https://docs.ethers.org/v6/getting-started/
[2] Example: ERC-20 Contract https://docs.ethers.org/v5/api/contract/example/
[3] typechain/ethers-v6 https://www.npmjs.com/package/@typechain/ethers-v6
[4] TypeChain/README.md at master · dethcrypto/TypeChain https://github.com/dethcrypto/TypeChain/blob/master/README.md
[5] Ethers.js: How to send ERC-20 Tokens | MetaMask Help Center https://support.metamask.io/develop/building-with-infura/javascript-typescript/how-to-send-erc20-tokens-ethersjs/
[6] ethers-js — Dev Tools - CryptoSkills https://cryptoskills.dev/skills/ethers-js
[7] ethers-v6: wrong type generated for listening to contract events · Issue #867 · dethcrypto/TypeChain https://github.com/dethcrypto/TypeChain/issues/867
[8] Transfer erc20 tokens ethers-v6 https://ethereum.stackexchange.com/questions/162687/transfer-erc20-tokens-ethers-v6
[9] ethers-types https://www.npmjs.com/package/ethers-types

