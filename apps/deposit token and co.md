> Quelle est la différence entre un deposit token et un fond tokenisé ?

Un **fund tokenisé** représente une part d’un fonds d’investissement sur une blockchain, tandis qu’un **deposit token** représente de la monnaie bancaire déposée, émise par une banque et transférable on-chain. En pratique, le premier est un actif de placement, le second est un moyen de paiement ou de règlement adossé à un dépôt bancaire.[1][6]

## Différence de nature

- **Fund tokenisé** : le jeton donne droit à une exposition à un fonds, par exemple un fonds monétaire ou un fonds de marché, avec une valeur qui dépend des actifs sous-jacents.  
- **Deposit token** : le jeton est adossé à des dépôts bancaires et sert à représenter de la monnaie détenue chez une banque.[6][1]

## Différence d’usage

- Un fund tokenisé sert surtout à **investir** et à gérer de la trésorerie avec une logique de rendement.  
- Un deposit token sert surtout à **transférer de la valeur** entre comptes ou contreparties, avec une logique de paiement et de règlement.[1][6]

## Différence juridique

- Un fund tokenisé reste lié à une structure de placement collective et à ses règles de gestion.  
- Un deposit token reste lié à une relation bancaire et à la créance sur la banque émettrice.[6][1]

## Version très simple

- **Fund tokenisé = part de produit d’investissement.**
- **Deposit token = monnaie bancaire tokenisée.**[1][6]

Si tu veux, je peux aussi te faire un tableau comparant **fund tokenisé, deposit token et stablecoin** pour un usage trésorerie ou DeFi.

Sources
[1] Stablecoins et dépôts tokenisés : quelles différences pour ... https://www.afte.com/publication/commissions/stablecoins-et-depots-tokenises-quelles-differences-pour-un-tresorier
[2] Ne pas confondre stablecoins et dépôts bancaires tokenisés https://www.andese.org/contributions/chroniques-de-nadia-antonin/630-ne-pas-confondre-stablecoins-et-depots-bancaires-tokenises.html
[3] [PDF] actifs de règlement tokenisés - Banque de France https://www.banque-france.fr/system/files/2026-03/GIP_synthese_actifs_de_reglement_tokenises.pdf
[4] Dépôts tokenisés vs stablecoins vs CBDC - L'écosystème ... https://fr.linkedin.com/pulse/tokenized-deposits-vs-stablecoins-cbdcs-evolving-kamlesh-nagware-9dlmf?tl=fr
[5] Quelles différences entre les stablecoins, les dépôts tokenisés et ... https://www.afte.com/publication/actualites/quelles-differences-entre-les-stablecoins-les-depots-tokenises-et-les
[6] The key difference between a 'tokenized deposit' and a 'deposit token' https://www.americanbanker.com/news/the-key-difference-between-a-tokenized-deposit-and-a-deposit-token
[7] REPORT ON TOKENISED DEPOSITS https://www.eba.europa.eu/sites/default/files/2024-12/4b294386-1235-463f-b9b5-08f255160435/Report%20on%20Tokenised%20deposits.pdf
[8] Plateforme de dépôts tokenisés pour un accès et une ... https://www.antiersolutions.com/fr/blogs/tokenized-deposit-platforms-unlocking-new-capabilities-for-banks-and-financial-institutions/
[9] Tokenisation and traditional finance - KPMG https://assets.kpmg.com/content/dam/kpmg/xx/pdf/2024/04/tokenisation-and-traditional-finance.pdf
[10] Stablecoin vs depositi tokenizzati: perché le differenze ... https://www.coindesk.com/it/opinion/2024/09/10/stablecoins-vs-tokenized-deposits-why-the-differences-matter

> Exemple d'implémentation comparée en Solidity avec l'interface ERC20 :

Oui — voici deux **implémentations ERC-20 comparées** en Solidity, l’une pour un **fund tokenisé** et l’autre pour un **deposit token**. La différence clé est que le fund tokenisé ressemble à un “share token” avec logique de NAV/mint-redeem, alors que le deposit token ressemble à une créance bancaire transférable, avec logique de dépôt/retrait et contrôle plus strict.[1][2][3]

## Hypothèses de conception

Je pars sur une version simple et pédagogique, sans KYC/whitelist, sans oracle de prix avancé, et sans gestion de conformité on-chain. OpenZeppelin indique que `ERC20` fournit la base standard, mais la mécanique de création/supply doit être ajoutée dans le contrat dérivé via `_mint`.[2][1]

## 1) Fund tokenisé

Ce modèle représente des parts d’un fonds. Le contrat mint des parts quand un investisseur apporte des actifs, et burn ces parts lors du rachat. La valeur par part peut être mise à jour par une variable `navPerShare`, ce qui colle à une logique de fonds plutôt qu’à une logique de paiement.[4][2]

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenizedFund is ERC20, Ownable {
   uint256 public navPerShare; // ex: 1e18 = 1.00 asset unit par part
   bool public mintingEnabled = true;

   event NavUpdated(uint256 newNavPerShare);

   constructor(
       string memory name_,
       string memory symbol_,
       uint256 initialNavPerShare
   ) ERC20(name_, symbol_) Ownable(msg.sender) {
       navPerShare = initialNavPerShare;
   }

   function updateNav(uint256 newNavPerShare) external onlyOwner {
       navPerShare = newNavPerShare;
       emit NavUpdated(newNavPerShare);
   }

   function mintShares(address to, uint256 assetAmount) external onlyOwner returns (uint256 shares) {
       require(mintingEnabled, "Mint disabled");
       require(navPerShare > 0, "NAV not set");
       shares = (assetAmount * 1e18) / navPerShare;
       _mint(to, shares);
   }

   function redeemShares(address from, uint256 shareAmount) external onlyOwner returns (uint256 assets) {
       require(navPerShare > 0, "NAV not set");
       assets = (shareAmount * navPerShare) / 1e18;
       _burn(from, shareAmount);
   }

   function disableMinting() external onlyOwner {
       mintingEnabled = false;
   }
}
```

## 2) Deposit token

Ce modèle représente des dépôts bancaires tokenisés. Ici, le contrat agit comme un registre de soldes de dépôts et la logique de mint/burn est directement liée à l’entrée et à la sortie de fonds. Dans un design réel, l’émission serait généralement réservée à la banque ou à un opérateur autorisé, ce qui est cohérent avec les dépôts tokenisés émis par des banques.[3][5]

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DepositToken is ERC20, Ownable {
   mapping(address => bool) public minters;

   event MinterSet(address indexed account, bool allowed);

   constructor(
       string memory name_,
       string memory symbol_
   ) ERC20(name_, symbol_) Ownable(msg.sender) {}

   modifier onlyMinter() {
       require(minters[msg.sender], "Not minter");
       _;
   }

   function setMinter(address account, bool allowed) external onlyOwner {
       minters[account] = allowed;
       emit MinterSet(account, allowed);
   }

   function deposit(address to, uint256 amount) external onlyMinter {
       _mint(to, amount);
   }

   function withdraw(address from, uint256 amount) external onlyMinter {
       _burn(from, amount);
   }
}
```

## Différences pratiques

| Aspect | Fund tokenisé | Deposit token |
|---|---|---|
| Rôle | Part de fonds | Dépôt bancaire tokenisé |
| Mint | Contre apport d’actifs / souscription | Contre dépôt bancaire |
| Burn | Rachat de parts | Retrait / remboursement |
| Variable centrale | NAV par part | Solde de dépôt |
| Gouvernance | Gérant / admin du fonds | Banque / émetteur autorisé |
| Lecture économique | Produit d’investissement | Monnaie de règlement / paiement |  

Ces deux modèles utilisent ERC-20 comme interface de transfert et de solde, mais leur **logique métier** n’est pas la même. Le standard ERC-20 décrit surtout `transfer`, `balanceOf`, `totalSupply`, `approve` et `transferFrom`; il n’impose pas comment un jeton doit être émis économiquement, donc c’est le contrat dérivé qui porte la différence de modèle.[1][2]

## Variante plus réaliste

Pour un fund tokenisé, on ajoute souvent :
- un oracle ou un pricing feed pour la NAV.
- une whitelist/KYC.
- des restrictions de transfert.
- une logique de frais de gestion ou de performance.  

Pour un deposit token, on ajoute souvent :
- contrôle d’accès fort sur `mint` et `burn`.
- preuve de réserve ou rapprochement off-chain.
- règles de conformité et de gel.
- mécanismes de règlement interbancaire.[6][3][1]

## Point important

Si tu veux une implémentation “production-grade”, il faut distinguer deux architectures :
- **token natif de fonds** avec souscription/rachat.
- **token de dépôt** avec émission par une entité bancaire et contraintes réglementaires.  

ERC-20 suffit pour le standard technique du jeton, mais pas pour exprimer à lui seul la nature juridique ou financière du produit.[2][3]

Je peux aussi te fournir une version **Hardhat + tests TypeScript**, ou une version plus avancée avec **ERC-4626 pour le fund tokenisé** et **AccessControl + EIP-712 pour le deposit token**.

Sources
[1] ERC-20 Token Standard https://ethereum.org/developers/docs/standards/tokens/erc-20/
[2] ERC20.sol - openzeppelin-contracts https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
[3] Stablecoins et dépôts tokenisés : quelles différences pour ... https://www.afte.com/publication/commissions/stablecoins-et-depots-tokenises-quelles-differences-pour-un-tresorier
[4] Tokenized Mutual Fund PoC – Full-Stack Ethereum dApp (Solidity + React + Chainlink) https://www.youtube.com/watch?v=RMFwqRRux6M
[5] Ne pas confondre stablecoins et dépôts bancaires tokenisés https://www.andese.org/contributions/chroniques-de-nadia-antonin/630-ne-pas-confondre-stablecoins-et-depots-bancaires-tokenises.html
[6] Quelles différences entre les stablecoins, les dépôts tokenisés et ... https://www.afte.com/publication/actualites/quelles-differences-entre-les-stablecoins-les-depots-tokenises-et-les
[7] deposite and withdraw erc20 token using smart contract https://ethereum.stackexchange.com/questions/114065/deposite-and-withdraw-erc20-token-using-smart-contract
[8] ScJa/ercfund https://github.com/ScJa/ercfund
[9] Deposit and withdraw ERC20 tokens (USDT, SHIB, MATIC) from a Solidity contract (Hardhat, Ethers.js) https://gist.github.com/BlockmanCodes/83d995ec9de0c4f5201c3556cba489e0
[10] GitHub - gtpaulose/escrow-solidity: A simple escrow and corresponding token contract written in Solidity https://github.com/gtpaulose/escrow-solidity
[11] Crowd Fund | Solidity 0.8 https://www.youtube.com/watch?v=P-4ucHdjGpU
[12] Solidity Tutorial: Creating an ERC20 Staking Contract - Medium https://medium.com/@cyri113/solidity-tutorial-creating-an-erc20-staking-contract-23f34ce30b34
[13] ERC-20 Token with Mint, Burn, and Pause - Grasp https://paths.grasp.study/public-modules/d30239e8-bdaa-4bed-b536-313778aa075e/lessons/a365861b-3f09-4060-aedd-850be43c6d0d

