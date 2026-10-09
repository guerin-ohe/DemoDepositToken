Un **portefeuille (wallet) Ethereum** implémenté en Solidity est un contrat intelligent qui permet de recevoir, stocker et envoyer des fonds (ETH ou tokens). Il peut également intégrer des fonctionnalités avancées telles que la gestion multi-signatures, des limites de retrait, ou des mécanismes de récupération.

---

## 🔐 Fonctionnalités essentielles d'un wallet en Solidity

1. **Propriété** : Le contrat définit un propriétaire (ou plusieurs) ayant des droits spécifiques.

2. **Réception de fonds** : Le contrat peut recevoir des ETH via des fonctions `payable`.([nextrope.com][1])

3. **Retrait de fonds** : Le propriétaire peut retirer des fonds vers une adresse spécifiée.([solidity-by-example.org][2])

4. **Sécurité** : Utilisation de modificateurs pour restreindre l'accès à certaines fonctions.

---

## 🧱 Exemple de contrat wallet simple en Solidity

Voici un exemple de contrat wallet basique :

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Wallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Fonction pour recevoir des ETH
    receive() external payable {}

    // Fonction pour retirer des ETH
    function withdraw(uint _amount, address payable _to) external {
        require(msg.sender == owner, "Seul le proprietaire peut retirer des fonds");
        require(address(this).balance >= _amount, "Fonds insuffisants");
        _to.transfer(_amount);
    }

    // Fonction pour consulter le solde du contrat
    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
```

Ce contrat permet au propriétaire de recevoir des ETH et de les retirer vers une adresse spécifiée.

---

## 🔐 Exemple de wallet multi-signature

Pour une sécurité accrue, un wallet peut nécessiter plusieurs signatures pour autoriser un retrait. Voici un exemple simplifié :

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract MultiSigWallet {
    address[] public owners;
    uint public required;

    struct Transaction {
        address to;
        uint value;
        bool executed;
        uint confirmations;
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint _required) {
        require(_owners.length >= _required, "Nombre de proprietaires insuffisant");
        owners = _owners;
        required = _required;
    }

    // Fonction pour soumettre une transaction
    function submitTransaction(address _to, uint _value) external {
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            executed: false,
            confirmations: 0
        }));
        confirmTransaction(txIndex);
    }

    // Fonction pour confirmer une transaction
    function confirmTransaction(uint _txIndex) public {
        require(!transactions[_txIndex].executed, "Transaction deja executee");
        require(!confirmations[_txIndex][msg.sender], "Transaction deja confirmee par cet utilisateur");

        confirmations[_txIndex][msg.sender] = true;
        transactions[_txIndex].confirmations += 1;

        if (transactions[_txIndex].confirmations >= required) {
            executeTransaction(_txIndex);
        }
    }

    // Fonction pour executer une transaction
    function executeTransaction(uint _txIndex) internal {
        Transaction storage txn = transactions[_txIndex];
        require(!txn.executed, "Transaction deja executee");
        require(address(this).balance >= txn.value, "Fonds insuffisants");

        txn.executed = true;
        payable(txn.to).transfer(txn.value);
    }

    // Fonction pour recevoir des ETH
    receive() external payable {}
}
```

Ce contrat nécessite un nombre défini de confirmations par les propriétaires pour exécuter une transaction.

---

## 🧪 Déploiement et tests

Pour déployer et tester ces contrats :

1. **Utilisez Remix IDE** : Une interface en ligne pour écrire, compiler et déployer des contrats Solidity.

2. **Configurez MetaMask** : Pour interagir avec le contrat déployé sur le réseau Ethereum ou un réseau de test.

3. **Testez les fonctions** : Envoyez des ETH au contrat, effectuez des retraits et vérifiez les restrictions d'accès.

---

Pour des exemples plus avancés et des tutoriels détaillés, vous pouvez consulter les ressources suivantes :

* [Solidity by Example](https://solidity-by-example.org/) : Une collection d'exemples pratiques pour apprendre Solidity.([solidity-by-example.org][3])

* [Solidity Documentation](https://docs.soliditylang.org/) : La documentation officielle de Solidity.([docs.soliditylang.org][4])

* [GitHub - Solidity Examples](https://github.com/samnang/solidity-examples) : Un dépôt contenant divers exemples de contrats intelligents en Solidity.([GitHub][5])

Ces ressources vous aideront à approfondir vos connaissances et à développer des wallets Ethereum personnalisés en Solidity.

[1]: https://nextrope.com/how-to-create-a-simple-wallet-smart-contract-using-solidity/?utm_source=chatgpt.com "How to create a simple “Wallet” smart contract using Solidity"
[2]: https://solidity-by-example.org/app/multi-sig-wallet/?utm_source=chatgpt.com "Multi-Sig Wallet - Solidity by Example"
[3]: https://solidity-by-example.org/?utm_source=chatgpt.com "Solidity by Example"
[4]: https://docs.soliditylang.org/?utm_source=chatgpt.com "Solidity — Solidity 0.8.30 documentation"
[5]: https://github.com/samnang/solidity-examples?utm_source=chatgpt.com "Collection of smart contracts examples and projects in Solidity."

Comment modifier le code du smart contrat Solidity ci-dessous pour implémenter un wallet de token ERC20 ?

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract SimpleWallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Fonction pour recevoir des ETH
    receive() external payable {}

    // Fonction pour retirer des ETH
    function withdraw(uint _amount, address payable _to) external {
        require(msg.sender == owner, "Seul le proprietaire peut retirer des fonds");
        require(address(this).balance >= _amount, "Fonds insuffisants");
        //_to.transfer(_amount);
        (bool success,) = _to.call{value: _amount}("");
        require(success, "Transfer failed");
    }

    // Fonction pour consulter le solde du contrat
    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}

Pour transformer ce contrat en **wallet ERC20**, il faut remplacer la logique de solde ETH par une référence vers un token ERC20, puis utiliser `balanceOf` et `transfer` du token. [docs.openzeppelin](https://docs.openzeppelin.com/contracts)
En pratique, le contrat ne “stocke” pas les tokens comme des ETH : il détient simplement des tokens ERC20 sur son adresse, et il peut ensuite les envoyer via `transfer`. [alchemy](https://www.alchemy.com/docs/how-to-interact-with-erc-20-tokens-in-solidity)

## Principe
Vous devez ajouter une interface `IERC20`, puis injecter l’adresse du token dans le constructeur. [docs.openzeppelin](https://docs.openzeppelin.com/contracts)
Ensuite, la fonction de consultation du solde doit appeler `token.balanceOf(address(this))`, et la fonction de retrait doit appeler `token.transfer(_to, _amount)`. [stackoverflow](https://stackoverflow.com/questions/70584388/sending-erc20-tokens-using-the-transfer-function)

## Exemple modifié
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SimpleERC20Wallet {
    address public owner;
    IERC20 public token;

    constructor(address tokenAddress) {
        owner = msg.sender;
        token = IERC20(tokenAddress);
    }

    // Dépôt de tokens : l'utilisateur doit d'abord faire approve() sur le contrat
    function deposit(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Deposit failed");
    }

    // Retrait de tokens par le propriétaire
    function withdraw(uint256 amount, address to) external {
        require(msg.sender == owner, "Seul le proprietaire peut retirer");
        require(token.transfer(to, amount), "Transfer failed");
    }

    // Solde du contrat en tokens ERC20
    function getTokenBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
```

## Ce qui change
- `receive()` n’est plus utile pour les tokens ERC20, car il ne s’agit pas d’ETH. [docs.openzeppelin](https://docs.openzeppelin.com/contracts/4.x/api/token/ERC20)
- `getBalance()` devient une fonction de solde token, basée sur `balanceOf`. [alchemy](https://www.alchemy.com/docs/how-to-interact-with-erc-20-tokens-in-solidity)
- Pour déposer des tokens depuis le wallet de l’utilisateur, il faut d’abord appeler `approve(contractAddress, amount)` sur le contrat du token, puis `deposit(amount)` sur votre wallet. [stackoverflow](https://stackoverflow.com/questions/72733964/accepting-any-erc20-token-as-a-payment-within-smart-contract)

## Variante sans dépôt
Si vous voulez seulement un contrat qui **envoie** des tokens qu’il possède déjà, vous pouvez supprimer `deposit()` et garder uniquement `withdraw()` avec `token.transfer(...)`. [stackoverflow](https://stackoverflow.com/questions/70584388/sending-erc20-tokens-using-the-transfer-function)
Dans ce cas, il faut transférer les tokens vers l’adresse du contrat avant de pouvoir les retirer. [alchemy](https://www.alchemy.com/docs/how-to-interact-with-erc-20-tokens-in-solidity)

## Point important
Pour un code plus robuste, beaucoup de projets utilisent les contrats OpenZeppelin plutôt qu’une interface maison, car ils fournissent les interfaces ERC20 standard et des implémentations éprouvées. [docs.openzeppelin](https://docs.openzeppelin.com/contracts/4.x/api/token/ERC20)


Comment passer un argument complémentaire "token" de type "adress" à l'objet Contrat de la bibliothéque Ether.js pour  instancier un smart contrat dont le constructeur prend un argement "token" de tpe "adress" ?

Dans **ethers.js**, on ne passe pas l’argument du constructeur à `new ethers.Contract(...)`. On le passe au moment du **déploiement** via `ContractFactory.deploy(...)`, puis on instancie le contrat avec son adresse après déploiement. [github](https://github.com/ethers-io/ethers.js/discussions/1806)

## Cas correct

Si ton constructeur Solidity est par exemple :

```solidity
constructor(address token) { ... }
```

alors côté JavaScript :

```js
const factory = new ethers.ContractFactory(abi, bytecode, signer);

const contract = await factory.deploy(tokenAddress);
await contract.waitForDeployment(); // v6
```

`tokenAddress` doit être une vraie adresse Ethereum sous forme de chaîne `0x...`. [ethereum](https://ethereum.org/fr/developers/tutorials/calling-a-smart-contract-from-javascript/)

## Si le contrat est déjà déployé

Si le smart contract existe déjà, tu fais simplement :

```js
const contract = new ethers.Contract(contractAddress, abi, signer);
```

Dans ce cas, tu ne repasses pas `tokenAddress`, car le constructeur a déjà été exécuté lors du déploiement. [docs.ethers](https://docs.ethers.org/v6/single-page/)

## Exemple complet

```js
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const factory = new ethers.ContractFactory(abi, bytecode, signer);

const tokenAddress = "0x1234567890123456789012345678901234567890";
const contract = await factory.deploy(tokenAddress);

await contract.waitForDeployment();
console.log("Déployé à :", await contract.getAddress());
```

## Point important

Le mot `adress` dans ta question semble être une faute de frappe pour `address`. En Solidity, le type attendu est bien `address`. [ethereum](https://ethereum.org/fr/developers/tutorials/interact-with-other-contracts-from-solidity/)

Si tu veux, je peux te montrer la version exacte pour **ethers v5** ou **ethers v6** selon ton projet.

Comment fonctionne l'interface ERC20 ?

Oui. En Solidity, l’“API ERC-20” désigne surtout **l’interface standard** qu’un contrat de token expose pour que d’autres contrats ou wallets puissent interagir avec lui de façon prévisible. Cette norme définit notamment le solde d’une adresse, le transfert de jetons, les autorisations de dépense et quelques métadonnées facultatives comme le nom ou le symbole.[2][9]

## Les fonctions principales

Les fonctions de base d’un ERC-20 sont généralement celles-ci : `totalSupply()` pour connaître l’offre totale, `balanceOf(address)` pour lire le solde d’une adresse, `transfer(address,uint256)` pour envoyer des jetons, `allowance(address,address)` pour lire l’autorisation accordée à un tiers, `approve(address,uint256)` pour donner cette autorisation, et `transferFrom(address,address,uint256)` pour déplacer des jetons au nom de quelqu’un d’autre.[9][2]

En pratique, `transfer` sert quand le détenteur envoie lui-même ses jetons, tandis que `approve` + `transferFrom` sert quand un contrat ou un tiers doit pouvoir dépenser des jetons à la place de l’utilisateur, par exemple dans un échange décentralisé.[2][9]

## Comment on l’utilise en Solidity

Pour interagir avec un token ERC-20 dans un contrat Solidity, on définit souvent une **interface** `IERC20` qui ne contient que les signatures des fonctions, sans logique interne. Ensuite, on stocke l’adresse du contrat du token et on appelle ses méthodes via cette interface.[1][6]

Exemple simple :

```solidity
interface IERC20 {
   function balanceOf(address account) external view returns (uint256);
   function transfer(address to, uint256 amount) external returns (bool);
   function approve(address spender, uint256 amount) external returns (bool);
   function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
```

Puis dans un contrat :

```solidity
IERC20 token = IERC20(tokenAddress);
uint256 solde = token.balanceOf(msg.sender);
bool ok = token.transfer(recipient, amount);
require(ok, "Transfer failed");
```

Cette approche est décrite dans la documentation d’interaction ERC-20 : on instancie l’interface avec l’adresse du token, puis on appelle les fonctions exposées par ce contrat.[6][1]

## Le mécanisme d’autorisation

Le point le plus important à comprendre est le duo `approve` / `transferFrom`. `approve(spender, amount)` enregistre une **allowance**, c’est-à-dire le montant maximum que `spender` peut dépenser pour le compte du propriétaire, puis `transferFrom(from, to, amount)` consomme cette autorisation pour déplacer les jetons.[9][2]

C’est ce mécanisme qui permet à un contrat de gérer des dépôts ou à une DEX de swapper des jetons sans que l’utilisateur appelle directement chaque transfert.[2][9]

## Exemple mental simple

Imagine un portefeuille qui contient 100 jetons.  
- `balanceOf(Alice)` lit “100”.  
- `Alice.transfer(Bob, 10)` envoie 10 jetons de Alice vers Bob.  
- `Alice.approve(ContratX, 50)` autorise `ContratX` à dépenser jusqu’à 50 jetons.  
- `ContratX.transferFrom(Alice, Bob, 20)` utilise cette autorisation pour transférer 20 jetons.[9][2]

## À retenir

L’ERC-20 n’est pas une “API” au sens web classique, mais une **norme d’interface de contrat**. En Solidity, on l’utilise en déclarant une interface, en pointant vers l’adresse du token, puis en appelant les fonctions standard comme `balanceOf`, `transfer`, `approve` et `transferFrom`.[1][9]

Si tu veux, je peux aussi te montrer un **exemple complet de contrat Solidity** qui reçoit un token ERC-20, vérifie le solde, puis le transfère.

Sources
[1] How to Interact with ERC-20 tokens in Solidity | Alchemy Docs https://www.alchemy.com/docs/how-to-interact-with-erc-20-tokens-in-solidity
[2] The complete guide to ERC-20 tokens and Solidity (2025) https://www.alchemy.com/overviews/erc20-solidity
[3] Mastering Blockchain Programming with Solidity https://www.oreilly.com/library/view/mastering-blockchain-programming/9781839218262/60ed8c13-7a5a-482a-8983-dd6a365d230a.xhtml
[4] OpenZeppelin Partie 2 : Création d'un token ERC-20 https://www.youtube.com/watch?v=N_SQlGoSi78
[5] Corso Solidity - Lezione 4 - Scriviamo un ERC20 https://www.youtube.com/watch?v=83tlGVLEZp0
[6] Transferts et approbation des jetons ERC-20 à partir d'un contrat intelligent de solidity https://ethereum.org/fr/developers/tutorials/transfers-and-approval-of-erc-20-tokens-from-a-solidity-smart-contract/
[7] Criando um Token ERC-20 em solidity (BEP-20 Binance) https://www.youtube.com/watch?v=XWY5x93vmIw
[8] Solidity Advanced #1 | Xây dựng ERC20 Token https://www.youtube.com/watch?v=VqTJyDyP1K8
[9] Norme de jeton ERC-20 | ethereum.org https://ethereum.org/fr/developers/docs/standards/tokens/erc-20/
[10] ERC-20 en sécurité https://ethereum.org/fr/developers/tutorials/erc20-with-safety-rails/

Oui — voici un exemple simple et réaliste d’un contrat Solidity qui **reçoit** des tokens ERC-20 via `transferFrom`, puis peut ensuite les **transférer** vers une autre adresse. Le mécanisme repose sur l’`allowance`: l’utilisateur doit d’abord appeler `approve` sur le token pour autoriser ce contrat à dépenser ses jetons.[1][2]

## Exemple de contrat

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
   function balanceOf(address account) external view returns (uint256);
   function transfer(address to, uint256 amount) external returns (bool);
   function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract TokenVault {
   IERC20 public immutable token;
   address public owner;

   event Deposited(address indexed from, uint256 amount);
   event Sent(address indexed to, uint256 amount);

   constructor(address tokenAddress) {
       token = IERC20(tokenAddress);
       owner = msg.sender;
   }

   modifier onlyOwner() {
       require(msg.sender == owner, "Not owner");
       _;
   }

   function deposit(uint256 amount) external {
       require(token.transferFrom(msg.sender, address(this), amount), "Deposit failed");
       emit Deposited(msg.sender, amount);
   }

   function sendTokens(address to, uint256 amount) external onlyOwner {
       require(token.transfer(to, amount), "Transfer failed");
       emit Sent(to, amount);
   }

   function vaultBalance() external view returns (uint256) {
       return token.balanceOf(address(this));
   }
}
```

Ce contrat illustre deux opérations standard ERC-20: `transferFrom` pour faire entrer les jetons dans le contrat, puis `transfer` pour les envoyer vers une autre adresse.[3][1]

## Comment ça fonctionne

Pour que `deposit(amount)` marche, l’utilisateur doit d’abord exécuter sur le contrat du token quelque chose comme `approve(vaultAddress, amount)`. Sans cette autorisation, `transferFrom` échoue, car le contrat n’a pas le droit de prélever les jetons depuis le portefeuille de l’utilisateur.[2][1]

Ensuite, une fois les jetons déposés dans le contrat, `sendTokens(to, amount)` peut les transférer depuis le solde du contrat lui-même vers un destinataire. Ici, le contrat devient le détenteur des jetons, donc il utilise simplement `transfer`.[1][3]

## Exemple d’utilisation

1. L’utilisateur approuve le contrat vault sur le token.  
2. L’utilisateur appelle `deposit(100)`.  
3. Le contrat récupère 100 jetons via `transferFrom(msg.sender, address(this), 100)`.  
4. Le propriétaire du vault appelle `sendTokens(alice, 50)`.  
5. Le contrat envoie 50 jetons à Alice via `transfer(alice, 50)`.[2][1]

## Points importants

Ce modèle suppose que le token suit bien l’interface ERC-20 standard, avec des retours `bool` sur `transfer` et `transferFrom`. En production, on utilise souvent les bibliothèques OpenZeppelin pour gérer plus proprement les cas particuliers, les erreurs de tokens non conformes et les bonnes pratiques de sécurité.[4][5][1][2]

Si tu veux, je peux aussi te donner une version **avec OpenZeppelin** ou une version **“deposit/withdraw”** plus proche d’un vrai coffre-fort de tokens.

Sources
[1] ERC-20 Token Standard | ethereum.org https://ethereum.org/developers/docs/standards/tokens/erc-20/
[2] ERC-20: Token Standard - Ethereum Improvement Proposals https://eips.ethereum.org/EIPS/eip-20
[3] Interacting with ERC20 Tokens - Avalanche Builder Hub https://build.avax.network/academy/blockchain/solidity-foundry/07-erc20-smart-contracts/03-interacting-with-erc20-tokens
[4] ERC-20 (Solidity Code Example) - Cyfrin https://www.cyfrin.io/glossary/erc-20-solidity-code-example
[5] ERC20 interface (IERC20.sol) | Polymath https://developers.polymath.network/polymath/api/ierc20
[6] Norme de jeton ERC-20 | ethereum.org https://ethereum.org/fr/developers/docs/standards/tokens/erc-20/
[7] Solidity ERC20 Token Contract Example | PDF https://www.scribd.com/document/810721267/Smart-Contract
[8] erc20-transferFrom.sol https://gist.github.com/aunyks/09b2bfb2b919527e4601aefb5dd5fdd3
[9] ERC20 Technical Walkthrough https://build.avax.network/academy/solidity-foundry/07-erc20-smart-contracts/02-technical-walkthrough
[10] what approve and allowance methods are really doing in ERC20 Standard? https://stackoverflow.com/questions/48664570/what-approve-and-allowance-methods-are-really-doing-in-erc20-standard

Comment initialiser la balance d'un client pour un token ERC20 ?

Pour **initialiser la balance** d’un client pour un token ERC-20, il faut en pratique **mint** des tokens vers l’adresse du client, plutôt que “modifier” directement un solde. La balance ERC-20 est stockée dans le contrat du token, et la fonction standard `balanceOf(address)` ne fait que lire ce solde.[1][2]

## Principe

La manière standard est d’ajouter une fonction de frappe, par exemple `_mint(client, amount)`, qui augmente le `totalSupply` et crédite la balance du compte ciblé, avec un événement `Transfer` depuis l’adresse zéro. OpenZeppelin documente ce comportement dans l’implémentation ERC-20.[3]

## Exemple Solidity

```solidity
function initializeClientBalance(address client, uint256 amount) external onlyOwner {
   _mint(client, amount);
}
```

Cette approche suppose que votre contrat autorise la frappe, soit via `onlyOwner`, soit via une logique d’admin plus stricte. Dans ce cas, le client verra ensuite son solde via `balanceOf(client)`.[2][3]

## Point important

On ne peut pas “écrire” directement dans le solde d’un ERC-20 standard depuis l’extérieur du contrat ; il faut passer par une fonction du contrat qui appelle `_mint`, ou transférer des tokens déjà existants vers l’adresse du client. La documentation et les guides ERC-20 montrent bien que le solde se consulte avec `balanceOf`, tandis que la création de tokens se fait par mint.[4][5][2]

## Variante simple

Si votre objectif est juste de **donner des tokens** à un client après déploiement, vous pouvez aussi :
- minter sur une adresse de trésorerie, puis
- faire un `transfer(client, amount)` depuis cette adresse.  
C’est utile si vous voulez séparer l’émission initiale de la distribution.[5][6]

Je peux aussi vous fournir un exemple complet en **Solidity + OpenZeppelin** pour un contrat mintable avec fonction `initClientBalance`.

Sources
[1] How to find erc20 tokens balance - Stack Overflow https://stackoverflow.com/questions/67989289/how-to-find-erc20-tokens-balance
[2] Comprendre le contrat intelligent de jeton ERC-20 https://ethereum.org/fr/developers/tutorials/understand-the-erc-20-token-smart-contract/
[3] Panduan Lengkap Kontrak ERC-20 - Ethereum.org https://ethereum.org/id/developers/tutorials/erc20-annotated-code/
[4] Jetons ERC-20 | Core DAO Official Documentation https://docs.coredao.org/fr/docs/Dev-Guide/erc20-tokens
[5] Présentation des tokens ERC-20 - Binance https://www.binance.com/fr/academy/articles/an-introduction-to-erc-20-tokens
[6] ERC-20 en sécurité https://ethereum.org/fr/developers/tutorials/erc20-with-safety-rails/
[7] How to get the balance of an ERC-20 token https://medium.com/coinmonks/how-to-get-the-balance-of-an-erc-20-token-e44fd34579ae
[8] OpenZeppelin Partie 2 : Création d'un token ERC-20 https://www.youtube.com/watch?v=N_SQlGoSi78
[9] Solidity - Balance is zero for the deployed ERC20 contract https://stackoverflow.com/questions/71102620/solidity-balance-is-zero-for-the-deployed-erc20-contract
[10] Retrieve the balance of an ERC-20 token https://docs.metamask.io/services/tutorials/ethereum/retrieve-the-balance-of-an-erc-20-token/

Peux tu me donner un exemple d'utilisation de l'interface onlyOwner de l'implémentation OpenZeppelin d'un jeton ERC20 ?

Oui — voici un exemple simple avec **OpenZeppelin** en Solidity, où une fonction d’un jeton ERC20 est réservée au propriétaire grâce à `onlyOwner`. [raw.githubusercontent](https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.3/contracts/access/Ownable.sol)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MonToken is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("MonToken", "MTK")
        Ownable(initialOwner)
    {
        _mint(initialOwner, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function pauseLikeAdminAction() external onlyOwner {
        // action réservée au propriétaire
    }
}
```

## Ce que fait `onlyOwner`
`onlyOwner` est un modificateur fourni par `Ownable` qui fait échouer l’appel si l’expéditeur n’est pas le propriétaire du contrat. [ichi](https://ichi.pro/fr/7-contrats-openzeppelin-que-vous-devez-toujours-utiliser-100755228146884)
Dans cet exemple, seul le propriétaire peut appeler `mint`, ce qui permet de créer de nouveaux tokens de manière contrôlée. [forum.openzeppelin](https://forum.openzeppelin.com/t/onlyowner-does-not-work-for-burn-addresses/44867)

## Usage concret
Par exemple, après déploiement, si `0xAdmin` est le propriétaire, alors :  
- `0xAdmin` peut appeler `mint(0xAlice, 1000 ether)`.  
- `0xBob` ne peut pas appeler `mint`, l’appel sera rejeté. [medium](https://medium.com/coinmonks/guide-to-ownership-and-access-control-in-solidity-f2d99f63c6d4)

## Version moderne
Avec les versions récentes d’OpenZeppelin, on passe souvent le propriétaire initial au constructeur via `Ownable(initialOwner)` plutôt que de le déduire implicitement du déployeur. [forum.openzeppelin](https://forum.openzeppelin.com/t/onlyowner-does-not-work-for-burn-addresses/44867)
C’est pratique pour les déploiements via scripts, multisig, ou contrats de factory. [forum.openzeppelin](https://forum.openzeppelin.com/t/how-to-set-ownership-for-uups-factory-deployed-erc20-tokens/43509)

Je peux aussi te donner un exemple avec `AccessControl` si tu veux un système plus flexible que `onlyOwner`.

Peux tu me décrire les fonctions approve() et allowance() de l'interface ERC20 ?

Oui. Dans l’interface ERC20, `approve()` sert à **autoriser** une adresse à dépenser une quantité donnée de tokens à ta place, tandis que `allowance()` sert à **consulter** combien cette adresse a encore le droit de dépenser. [metaschool](https://metaschool.so/articles/what-are-erc20-approve-erc20-allowance-methods)

## `approve()`
`approve(address spender, uint256 amount)` permet au détenteur de tokens de donner une permission de dépense à `spender` pour un montant maximal `amount`. [github](https://github.com/binodnp/openzeppelin-solidity/blob/master/docs/IERC20.md)
Cette autorisation est ensuite utilisée par un contrat ou une adresse pour appeler `transferFrom()` et déplacer les tokens autorisés. [stackoverflow](https://stackoverflow.com/questions/48664570/what-approve-and-allowance-methods-are-really-doing-in-erc20-standard)
En pratique, c’est le mécanisme utilisé par beaucoup de DEX, de plateformes de staking ou d’applications DeFi avant de pouvoir agir sur tes tokens. [speedrunethereum](https://speedrunethereum.com/guides/erc20-approve-pattern)

Exemple simple :
```solidity
token.approve(address(dex), 1000);
```
Ici, le contrat `dex` peut dépenser jusqu’à 1000 tokens au nom de l’utilisateur. [stackoverflow](https://stackoverflow.com/questions/48664570/what-approve-and-allowance-methods-are-really-doing-in-erc20-standard)

## `allowance()`
`allowance(address owner, address spender)` renvoie le **solde d’autorisation restant** : combien `spender` peut encore dépenser depuis le compte de `owner`. [metaschool](https://metaschool.so/articles/what-are-erc20-approve-erc20-allowance-methods)
Cette fonction ne modifie rien, elle sert seulement à lire l’état actuel des permissions. [docs.openzeppelin](https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20)
Après un `approve()`, cette valeur correspond au plafond autorisé, puis elle diminue au fur et à mesure des appels à `transferFrom()`. [blog.csdn](https://blog.csdn.net/linzhiji/article/details/131902330)

Exemple :
```solidity
uint256 remaining = token.allowance(user, address(dex));
```
Cela permet de vérifier combien le contrat `dex` peut encore retirer du compte `user`. [stackoverflow](https://stackoverflow.com/questions/48664570/what-approve-and-allowance-methods-are-really-doing-in-erc20-standard)

## Point important
Une nouvelle opération `approve()` remplace généralement l’ancienne autorisation par la nouvelle valeur, ce qui explique pourquoi il faut être prudent quand on change une allowance déjà en place. [auditbase](https://auditbase.com/detectors/approval-revert-non-zero-current)
C’est aussi pour cela qu’on voit souvent des modèles comme “approuver puis transférer”, ou des pratiques de sécurité pour éviter des erreurs de montant. [ethereum](https://ethereum.org/fr/developers/tutorials/transfers-and-approval-of-erc-20-tokens-from-a-solidity-smart-contract/)

Je peux aussi te montrer un exemple complet avec `approve()`, `allowance()` et `transferFrom()` dans un petit contrat Solidity.

Avec Typescript, comment je veux caster un objet de type Stablecoin implémentant l'interface IERC20 en objet ERC20 ?

En TypeScript, tu ne “casses” pas vraiment un objet `Stablecoin` en `ERC20` au sens runtime : tu fais une **assertion de type** pour dire au compilateur de le traiter comme `ERC20`. [typescriptlang](https://www.typescriptlang.org/fr/docs/handbook/typescript-in-5-minutes-oop.html)

## Exemple simple

```ts
const stablecoin = getStablecoin(); // type: Stablecoin & IERC20

const erc20 = stablecoin as ERC20;
```

Si `Stablecoin` n’est pas réellement compatible avec `ERC20`, TypeScript peut laisser passer le cast, mais tu risques une erreur plus tard à l’exécution. [hintsage](https://hintsage.com/fr/knowledge-base/question/6394ba73-f020-42ef-bcc2-bf5ddd7478ed)

## Cas avec conversion plus sûre

Si `Stablecoin` implémente bien `IERC20` et que `ERC20` est juste un type plus précis, le mieux est souvent de typer directement la variable comme `ERC20` à la source plutôt que de caster après coup. [angular](https://angular.fr/typescript/interface)

```ts
const erc20: ERC20 = stablecoin as unknown as ERC20;
```

Le double cast `as unknown as ERC20` contourne encore plus les vérifications, donc il faut l’utiliser seulement si tu es certain de la compatibilité réelle. [hintsage](https://hintsage.com/fr/knowledge-base/question/6394ba73-f020-42ef-bcc2-bf5ddd7478ed)

## Recommandation

- Utilise `as ERC20` si tu veux seulement ajuster le type côté compilateur. [hintsage](https://hintsage.com/fr/knowledge-base/question/6394ba73-f020-42ef-bcc2-bf5ddd7478ed)
- Utilise `as unknown as ERC20` en dernier recours. [hintsage](https://hintsage.com/fr/knowledge-base/question/6394ba73-f020-42ef-bcc2-bf5ddd7478ed)
- Idéalement, fais en sorte que ton objet soit déjà typé `ERC20` ou qu’une fonction retourne `ERC20` directement. [typescriptlang](https://www.typescriptlang.org/fr/docs/handbook/typescript-in-5-minutes-oop.html)

Si tu veux, je peux te montrer la version exacte avec des interfaces `IERC20`, `ERC20` et `Stablecoin` en TypeScript.

> Je veux créer une page home.ejs avec le moteur EJS, TypeScript et Express.JS qui affiche une liste d'adresse et de clé depuis une liste dont le contenu est [adress: string, key: string] ?

Oui. Le plus propre est de définir ta liste comme un tableau de tuples TypeScript, puis de la passer à `home.ejs` avec `res.render()` pour l’afficher en boucle. [typescriptlang](https://www.typescriptlang.org/play/typescript/type-primitives/tuples.ts.html)

## TypeScript

Si ton contenu est vraiment une paire fixe `[adresse, key]`, utilise ce type :

```ts
type AdresseKey = [adresse: string, key: string];

const liste: AdresseKey[] = [
  ["10 rue de Paris", "clé1"],
  ["25 avenue Victor Hugo", "clé2"],
];
```

Un tuple convient bien ici parce que chaque élément du tableau a toujours exactement deux valeurs dans le même ordre. [typescriptlang](https://www.typescriptlang.org/play/typescript/type-primitives/tuples.ts.html)

## Route Express

```ts
import express from "express";

const app = express();
app.set("view engine", "ejs");

type AdresseKey = [adresse: string, key: string];

const liste: AdresseKey[] = [
  ["10 rue de Paris", "clé1"],
  ["25 avenue Victor Hugo", "clé2"],
];

app.get("/", (req, res) => {
  res.render("home", { liste });
});

app.listen(3000);
```

`res.render()` permet de transmettre des données au template EJS via un objet, qui devient ensuite accessible dans la vue. [medium](https://medium.com/@bloomaman/rendering-views-with-node-express-and-ejs-415af1493c74)

## Vue `home.ejs`

```ejs
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Home</title>
</head>
<body>
  <h1>Liste des adresses et clés</h1>

  <ul>
    <% liste.forEach(([adresse, key]) => { %>
      <li>
        <strong><%= adresse %></strong> : <%= key %>
      </li>
    <% }) %>
  </ul>
</body>
</html>
```

EJS permet de parcourir un tableau avec `<% %>` et d’afficher les valeurs avec `<%= %>`. [stackoverflow](https://stackoverflow.com/questions/56600633/displaying-arrays-in-a-list-with-ejs)

## Version objet

Tu peux aussi convertir ton tuple en objet pour un code plus lisible :

```ts
type AdresseKey = {
  adresse: string;
  key: string;
};

const liste: AdresseKey[] = [
  { adresse: "10 rue de Paris", key: "clé1" },
  { adresse: "25 avenue Victor Hugo", key: "clé2" },
];
```

Et dans `home.ejs` :

```ejs
<ul>
  <% liste.forEach(item => { %>
    <li><strong><%= item.adresse %></strong> : <%= item.key %></li>
  <% }) %>
</ul>
```

Si tu veux, je peux te donner une structure de projet complète `Express + TypeScript + EJS` prête à copier-coller.

> Dans l'exemple suivant, je veux remplacer l'affichage de la clé par celle du solde de l'adresse via l'appel à une fonction "getSolde(adress)" ?

Le plus robuste est de **calculer les soldes côté serveur** dans ta route Express, puis de passer ces valeurs à `home.ejs` au lieu d’appeler directement `getSolde` dans le template. [forum.freecodecamp](https://forum.freecodecamp.org/t/express-ejs-help/128858)

Je te montre deux approches, en supposant que `getSolde(adress)` est une fonction TypeScript (potentiellement asynchrone) qui retourne le solde.

***

## 1. Calculer les soldes dans la route (recommandé)

### TypeScript

```ts
type AdresseKey = [adresse: string, key: string];

// Liste originale
const liste: AdresseKey[] = [
  ["10 rue de Paris", "clé1"],
  ["25 avenue Victor Hugo", "clé2"],
];

// Exemple de fonction de solde (sync ou async)
async function getSolde(adress: string): Promise<number> {
  // ... appel à une API, base de données, etc.
  return 42; // exemple
}
```

### Route Express (async)

```ts
import express from "express";

const app = express();
app.set("view engine", "ejs");

type AdresseKey = [adresse: string, key: string];

const liste: AdresseKey[] = [
  ["10 rue de Paris", "clé1"],
  ["25 avenue Victor Hugo", "clé2"],
];

async function getSolde(adress: string): Promise<number> {
  // logique réelle ici
  return 42;
}

app.get("/", async (req, res) => {
  // On enrichit la liste avec le solde
  const listeAvecSolde = await Promise.all(
    liste.map(async ([adresse, key]) => {
      const solde = await getSolde(adresse);
      return { adresse, key, solde };
    })
  );

  res.render("home", { liste: listeAvecSolde });
});

app.listen(3000);
```

Cette technique permet de gérer correctement les fonctions asynchrones et de garder la logique métier hors du template. [stackoverflow](https://stackoverflow.com/questions/63137754/running-a-foreach-on-an-array-passed-to-ejs-template)

### `home.ejs`

```ejs
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Home</title>
</head>
<body>
  <h1>Liste des adresses et soldes</h1>

  <ul>
    <% liste.forEach(item => { %>
      <li>
        <strong><%= item.adresse %></strong>
        — Solde : <%= item.solde %> <!-- affichage du solde -->
      </li>
    <% }) %>
  </ul>
</body>
</html>
```

Ici, on n’affiche plus la clé, mais le solde calculé côté serveur. [geeksforgeeks](https://www.geeksforgeeks.org/node-js/how-to-render-dynamic-lists-using-ejs-and-express/)

***

## 2. Passer la fonction à EJS (possible mais moins conseillé)

Si `getSolde` est **synchrone** et très légère, tu peux la passer au template :

### Route Express

```ts
app.get("/", (req, res) => {
  res.render("home", {
    liste,
    getSolde, // on passe la fonction
  });
});
```

### `home.ejs`

```ejs
<ul>
  <% liste.forEach(([adresse, key]) => { %>
    <li>
      <strong><%= adresse %></strong>
      — Solde : <%= getSolde(adresse) %>
    </li>
  <% }) %>
</ul>
```

Cette approche est décrite dans des exemples où l’on passe des fonctions à EJS via `res.render` ou `app.locals`, mais elle devient vite problématique si `getSolde` fait des appels asynchrones (promises, HTTP, DB). [stackoverflow](https://stackoverflow.com/questions/30535309/where-should-i-define-js-function-to-call-in-ejs-template)

***

## Que je te recommande

- Si `getSolde` est **async** (API blockchain, DB, etc.), utilise la **solution 1** avec `Promise.all` dans ta route.
- Si tu veux absolument garder la structure en tuple `[adress, key]`, enrichis-la côté serveur en un objet `{ adresse, key, solde }` avant de rendre la vue.
- Garde EJS limité à la **logique d’affichage**, pas de logique de récupération de données complexes. [forum.freecodecamp](https://forum.freecodecamp.org/t/express-ejs-help/128858)

Si tu me colles ton code actuel (route + `home.ejs` + signature de `getSolde`), je peux te faire la version ajustée exactement sur ton cas.


> Comment spécifier l'adresse appelante un smart contrat avec Ether.js ?

Avec ethers.js, c’est le **signer** qui détermine l’adresse qui “from” l’appel. Pour changer l’adresse appelante, tu dois soit :

- créer le contrat directement avec un signer donné  
- ou re-connecter le contrat à un autre signer via `contract.connect(signer)`.[7][10]

### Exemple basique (v5/v6)

```ts
import { ethers } from "ethers";

// provider + 2 signers (ex: Hardhat, Anvil, etc.)
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const [signer1, signer2] = await provider.listAccounts().then(
 (accs) => [provider.getSigner(accs[0]), provider.getSigner(accs[1])]
);

// adresse + ABI du contrat
const contractAddress = "0x...";
const abi = [ /* ... */ ];

// 1) Contrat “bindé” à signer1 => les calls/transactions partent de signer1
const contractFrom1 = new ethers.Contract(contractAddress, abi, signer1);

// 2) Plus tard, même contrat mais “from” signer2 :
const contractFrom2 = contractFrom1.connect(signer2);

// Appel d’une fonction qui envoie une tx (modif d’état)
await contractFrom1.myFunc(...args); // msg.sender = address(signer1)
await contractFrom2.myFunc(...args); // msg.sender = address(signer2)
```

Dans ethers, tu ne passes pas `{ from: ... }` comme avec web3.js (sauf cas très spécifiques bas niveau) ; c’est le signer qui porte la clé privée et donc l’adresse qui va signer et envoyer la transaction.[6][7]

### Lecture vs écriture

- Appels “lecture” (`view`, `pure`) : `await contract.someView(arg)` depuis un contrat avec signer ou juste un provider, ça ne crée pas de tx et ne dépend pas vraiment d’une adresse `from` côté EVM, sauf si ton contrat lit explicitement `tx.origin` ou `msg.sender`.[3][6]
- Appels “écriture” (transactions) : toujours signer le contrat avec l’adresse que tu veux en `msg.sender`, via le signer.[6][7]

### Pattern typique (Hardhat / tests)

```ts
const [owner, alice, bob] = await ethers.getSigners();

const contract = await MyContract__factory.connect(owner).deploy();
await contract.deployed();

// appel “from owner”
await contract.doSomething();

// appel “from alice”
await contract.connect(alice).doSomething();

// appel “from bob”
await contract.connect(bob).doSomething();
```

Si tu veux, dis-moi la version d’ethers (v5/v6) et je te donne le snippet exact adapté (TS, front ou backend).

Sources
[1] Contracts — ethers.js 4.0.0 documentation https://docs.ethers.org/v4/api-contract.html
[2] Appeler un contrat intelligent depuis JavaScript https://ethereum.org/fr/developers/tutorials/calling-a-smart-contract-from-javascript/
[3] Contracts — ethers.js 3.0.0 documentation https://docs.ethers.org/v3/api-contract.html
[4] How to call a contract function/method using ethersjs https://ethereum.stackexchange.com/questions/120817/how-to-call-a-contract-function-method-using-ethersjs
[5] Volání chytrého kontraktu z JavaScriptu | ethereum.org https://ethereum.org/cs/developers/tutorials/calling-a-smart-contract-from-javascript/
[6] Contracts https://docs.ethers.org/v6/api/contract/
[7] Contract https://docs.ethers.org/v5/api/contract/contract/
[8] 合约— ethers.js v4中文文档 https://learnblockchain.cn/docs/ethers.js/api-contract.html
[9] Trying to use eth_call to contract function which takes an address as it's argument https://ethereum.stackexchange.com/questions/36221/trying-to-use-eth-call-to-contract-function-which-takes-an-address-as-its-argum
[10] How do I specify which account to call a function from with Ethers.js? https://www.reddit.com/r/ethdev/comments/o32det/how_do_i_specify_which_account_to_call_a_function/

> Pour afficher un tableau de nombres flottants dans une vue EJS avec Express.js et TypeScript, tu passes le tableau via `res.render()` et tu itères dessus dans ton template avec `<% %>` et `<%= %>`.[1][2]

## Côté Express/TypeScript (controller ou route)

Dans ton fichier de route/controller TypeScript :

```ts
import { Request, Response } from 'express';

export function getValues(req: Request, res: Response) {
 // Tableau de nombres (flottants)
 const values: number[] = [3.14, 2.718, 1.414, 0.577, 9.81];

 // Optionnel : formater les nombres côté serveur
 // const formattedValues = values.map(v => v.toFixed(2));

 res.render('values', { values });
 // "values" sera accessible dans la vue EJS
}
```

Dans ton `app.ts` (ou `server.ts`), assure-toi d’avoir configuré EJS :

```ts
import express from 'express';
import path from 'path';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ... tes routes
```

## Côté vue EJS (`views/values.ejs`)

Exemple simple sous forme de liste :

```ejs
<!DOCTYPE html>
<html lang="fr">
<head>
 <meta charset="UTF-8">
 <title>Valeurs</title>
</head>
<body>
 <h1>Tableau de valeurs</h1>

 <ul>
   <% values.forEach((v, i) => { %>
     <li>Index <%= i %>: <%= v %></li>
   <% }); %>
 </ul>
</body>
</html>
```

Si tu veux un vrai tableau HTML :

```ejs
<table border="1" cellpadding="4" cellspacing="0">
 <thead>
   <tr>
     <th>Index</th>
     <th>Valeur</th>
   </tr>
 </thead>
 <tbody>
   <% values.forEach((v, i) => { %>
     <tr>
       <td><%= i %></td>
       <td><%= v %></td>
     </tr>
   <% }); %>
 </tbody>
</table>
```

## Contrôle de l’affichage des flottants

Tu peux formater côté serveur ou côté vue :

**Côté serveur (TypeScript) :**

```ts
const valuesFormatted: string[] = values.map(v => v.toFixed(2));
res.render('values', { values: valuesFormatted });
```

**Côté EJS :**

```ejs
<td><%= v.toFixed(2) %></td>
```

ou avec un nombre fixe de décimales :

```ejs
<td><%= Number(v).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) %></td>
```

Si tu veux un exemple complet avec un controller Express + route + vue, dis-moi ta structure de projet (dossiers `routes`, `controllers`, `views`) et je te donne un snippet adapté.

Sources
[1] Express Template Engines https://medium.com/@reidwilliamson2/express-template-engines-388c8329ba92
[2] How to pass a data array from express.js to ejs template and render them https://stackoverflow.com/questions/45983078/how-to-pass-a-data-array-from-express-js-to-ejs-template-and-render-them
[3] Passing Data from Express to EJS vs NestJs https://medium.com/@pirvan.marian/passing-data-from-express-to-ejs-vs-nestjs-a-developers-guide-2406cded67d9
[4] TypeScript + Node.js + Express + EJSでMVCをやってみる - Qiita https://qiita.com/s-yoshida/items/a2e0283891d50c65482e
[5] How To Use EJS to Template Your Node Application https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
[6] Pass Data into EJS in Express.js | Easy Tutorial for Beginners https://www.youtube.com/watch?v=Ua_kP_HEZQU
[7] A Simple ExpressJS and TypeScript Project https://www.codemag.com/Article/2011021/A-Simple-ExpressJS-and-TypeScript-Project
[8] Typescript, pass arguments to Ejs page https://stackoverflow.com/questions/71627503/typescript-pass-arguments-to-ejs-page
[9] Using EJS Template Engine With Express.js https://www.topcoder.com/thrive/articles/using-ejs-template-engine-with-express-js
[10] Using EJS with Express https://github.com/mde/ejs/wiki/Using-EJS-with-Express

Oui, mais il faut passer par **une route HTTP** côté serveur : un lien dans EJS ne peut pas modifier directement une variable serveur sans requête. Le plus simple est d’utiliser un `href` vers une route qui met à jour l’état en mémoire puis renvoie une redirection vers la même vue. [github](https://github.com/learn-co-curriculum/using-ejs-in-express)

## Principe
- Le lien déclenche un `GET` vers une route Express.
- La route modifie la variable côté serveur.
- La route fait ensuite un `redirect('/')` pour réafficher la vue courante avec les nouvelles données. [github](https://github.com/learn-co-curriculum/using-ejs-in-express)

## Exemple Express + TypeScript
```ts
import express, { Request, Response } from 'express';

const app = express();
app.set('view engine', 'ejs');

let state = false;

app.get('/', (req: Request, res: Response) => {
  res.render('index', { state });
});

app.get('/toggle', (req: Request, res: Response) => {
  state = !state;
  res.redirect('/');
});

app.listen(3000);
```

## Vue EJS
```ejs
<p>État actuel : <%= state ? 'ON' : 'OFF' %></p>
<a href="/toggle">Basculer l’état</a>
```

## Point important
Si vous parlez d’une “variable serveur” globale en mémoire, elle ne convient que pour un prototype : en production, elle est partagée entre utilisateurs, perdue au redémarrage, et peut poser problème avec plusieurs instances. Pour un vrai état applicatif, utilisez une session, une base de données ou un cache partagé. [leapcell.medium](https://leapcell.medium.com/no-framework-overkill-just-express-and-jsx-b9b2f4b7a0b5)

> Oui, mais il faut passer par **une route HTTP** côté serveur : un lien dans EJS ne peut pas modifier directement une variable serveur sans requête. Le plus simple est d’utiliser un `href` vers une route qui met à jour l’état en mémoire puis renvoie une redirection vers la même vue. [github](https://github.com/learn-co-curriculum/using-ejs-in-express)

## Principe
- Le lien déclenche un `GET` vers une route Express.
- La route modifie la variable côté serveur.
- La route fait ensuite un `redirect('/')` pour réafficher la vue courante avec les nouvelles données. [github](https://github.com/learn-co-curriculum/using-ejs-in-express)

## Exemple Express + TypeScript
```ts
import express, { Request, Response } from 'express';

const app = express();
app.set('view engine', 'ejs');

let state = false;

app.get('/', (req: Request, res: Response) => {
  res.render('index', { state });
});

app.get('/toggle', (req: Request, res: Response) => {
  state = !state;
  res.redirect('/');
});

app.listen(3000);
```

## Vue EJS
```ejs
<p>État actuel : <%= state ? 'ON' : 'OFF' %></p>
<a href="/toggle">Basculer l’état</a>
```

## Point important
Si vous parlez d’une “variable serveur” globale en mémoire, elle ne convient que pour un prototype : en production, elle est partagée entre utilisateurs, perdue au redémarrage, et peut poser problème avec plusieurs instances. Pour un vrai état applicatif, utilisez une session, une base de données ou un cache partagé. [leapcell.medium](https://leapcell.medium.com/no-framework-overkill-just-express-and-jsx-b9b2f4b7a0b5)

Si vous voulez, je peux vous proposer la même chose en **version propre avec session utilisateur** ou en **POST + formulaire** plutôt qu’avec un lien.


> Récupérer les événements transferts avec Ethers.js ?

Avec `ethers.js v6`, il faut utiliser `contract.filters.Transfer(...)` pour construire les filtres, puis `contract.queryFilter(...)` pour interroger les événements historiques. Cette approche concerne les événements émis par des contrats, notamment l’événement ERC-20 `Transfer(address indexed from, address indexed to, uint256 value)`. [docs.ethers](https://docs.ethers.org/v6/api/contract/)

> Remarque : `contract.filter` n’existe pas ; la syntaxe correcte est `contract.filters.Transfer(...)`.

## Fonction TypeScript

```ts
import {
  Contract,
  JsonRpcProvider,
  getAddress,
  isAddress,
  Log,
  ZeroAddress,
  formatUnits,
} from "ethers";

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

export interface TokenTransaction {
  tokenContract: string;
  tokenSymbol: string;
  tokenDecimals: number;
  transactionHash: string;
  blockNumber: number;
  logIndex: number;
  from: string;
  to: string;
  amount: bigint;
  formattedAmount: string;
  direction: "in" | "out" | "self";
  isMint: boolean;
  isBurn: boolean;
}

interface TransferEventLog extends Log {
  args?: {
    from: string;
    to: string;
    value: bigint;
  };
}

/**
 * Retourne les transferts ERC-20 liés à une adresse EVM.
 *
 * @param provider Provider ethers.js connecté au réseau cible
 * @param walletAddress Adresse EVM à analyser
 * @param tokenAddresses Adresses des contrats ERC-20 à analyser
 * @param fromBlock Bloc de début inclus
 * @param toBlock Bloc de fin inclus ou "latest"
 * @param blockStep Nombre maximal de blocs interrogés par requête
 */
export async function getErc20TransactionHistory(
  provider: JsonRpcProvider,
  walletAddress: string,
  tokenAddresses: string[],
  fromBlock: number | string = 0,
  toBlock: number | string = "latest",
  blockStep = 10_000
): Promise<TokenTransaction[]> {
  if (!isAddress(walletAddress)) {
    throw new Error(`Adresse EVM invalide : ${walletAddress}`);
  }

  const address = getAddress(walletAddress);

  const normalizedTokenAddresses = tokenAddresses.map((tokenAddress) => {
    if (!isAddress(tokenAddress)) {
      throw new Error(`Adresse de token invalide : ${tokenAddress}`);
    }

    return getAddress(tokenAddress);
  });

  if (normalizedTokenAddresses.length === 0) {
    return [];
  }

  const resolvedFromBlock =
    typeof fromBlock === "number"
      ? fromBlock
      : await provider.getBlockNumber();

  const resolvedToBlock =
    toBlock === "latest"
      ? await provider.getBlockNumber()
      : Number(toBlock);

  if (resolvedFromBlock > resolvedToBlock) {
    throw new Error("fromBlock doit être inférieur ou égal à toBlock");
  }

  const history: TokenTransaction[] = [];

  for (const tokenAddress of normalizedTokenAddresses) {
    const tokenContract = new Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const [symbol, decimals] = await Promise.all([
      tokenContract.symbol().catch(() => "UNKNOWN"),
      tokenContract.decimals().catch(() => 18),
    ]);

    for (
      let currentFromBlock = resolvedFromBlock;
      currentFromBlock <= resolvedToBlock;
      currentFromBlock += blockStep
    ) {
      const currentToBlock = Math.min(
        currentFromBlock + blockStep - 1,
        resolvedToBlock
      );

      // Événements où l'adresse est le destinataire.
      const incomingFilter = tokenContract.filters.Transfer(
        null,
        address
      );

      // Événements où l'adresse est l'expéditeur.
      const outgoingFilter = tokenContract.filters.Transfer(
        address,
        null
      );

      const [incomingLogs, outgoingLogs] = await Promise.all([
        tokenContract.queryFilter(
          incomingFilter,
          currentFromBlock,
          currentToBlock
        ),
        tokenContract.queryFilter(
          outgoingFilter,
          currentFromBlock,
          currentToBlock
        ),
      ]);

      const logsById = new Map<string, TransferEventLog>();

      for (const log of [...incomingLogs, ...outgoingLogs]) {
        const transferLog = log as TransferEventLog;

        const logId = `${transferLog.transactionHash}:${transferLog.index}`;

        logsById.set(logId, transferLog);
      }

      for (const log of logsById.values()) {
        if (!log.args) {
          continue;
        }

        const { from, to, value } = log.args;

        const isMint = from.toLowerCase() === ZeroAddress.toLowerCase();
        const isBurn = to.toLowerCase() === ZeroAddress.toLowerCase();

        const isIncoming =
          to.toLowerCase() === address.toLowerCase();

        const isOutgoing =
          from.toLowerCase() === address.toLowerCase();

        const direction: TokenTransaction["direction"] =
          isIncoming && isOutgoing
            ? "self"
            : isIncoming
              ? "in"
              : "out";

        history.push({
          tokenContract,
          tokenSymbol: symbol,
          tokenDecimals: Number(decimals),
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
          logIndex: log.index,
          from,
          to,
          amount: value,
          formattedAmount: formatUnits(value, decimals),
          direction,
          isMint,
          isBurn,
        });
      }
    }
  }

  return history.sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) {
      return b.blockNumber - a.blockNumber;
    }

    return b.logIndex - a.logIndex;
  });
}
```

## Exemple d’utilisation

```ts
import { JsonRpcProvider } from "ethers";
import { getErc20TransactionHistory } from "./getErc20TransactionHistory";

async function main(): Promise<void> {
  const provider = new JsonRpcProvider(
    process.env.RPC_URL ?? "https://ethereum.publicnode.com"
  );

  const walletAddress = "0x1234567890123456789012345678901234567890";

  const transactions = await getErc20TransactionHistory(
    provider,
    walletAddress,
    [
      // USDC Ethereum Mainnet
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",

      // DAI Ethereum Mainnet
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    ],
    18_000_000,
    "latest"
  );

  for (const transaction of transactions) {
    console.log({
      date: transaction.blockNumber,
      token: transaction.tokenSymbol,
      amount: transaction.formattedAmount,
      direction: transaction.direction,
      from: transaction.from,
      to: transaction.to,
      hash: transaction.transactionHash,
      mint: transaction.isMint,
      burn: transaction.isBurn,
    });
  }
}

main().catch(console.error);
```

## Filtrer directement un seul contrat

Pour un seul token, la partie essentielle est :

```ts
const contract = new Contract(tokenAddress, ERC20_ABI, provider);

const receivedFilter = contract.filters.Transfer(
  null,
  userAddress
);

const sentFilter = contract.filters.Transfer(
  userAddress,
  null
);

const received = await contract.queryFilter(
  receivedFilter,
  fromBlock,
  toBlock
);

const sent = await contract.queryFilter(
  sentFilter,
  fromBlock,
  toBlock
);
```

Les paramètres `from` et `to` sont filtrables parce qu’ils sont déclarés `indexed` dans l’événement ERC-20. `queryFilter` permet ensuite de rechercher les événements entre deux blocs inclusifs. [docs.ethers](https://docs.ethers.org/v6/api/contract/)

## Limites

Cette fonction retourne les transferts de tokens ERC-20 pour les contrats fournis dans `tokenAddresses`. Elle ne peut pas découvrir automatiquement tous les tokens associés à une adresse sans utiliser un indexeur ou une liste préalable de contrats.

Elle ne retourne pas non plus les transactions natives en ETH : un simple transfert d’ETH n’émet pas d’événement de contrat `Transfer`. Pour l’historique natif complet, il faut parcourir les blocs ou utiliser un indexeur comme Etherscan, Covalent ou Alchemy. [ethereum.stackexchange](https://ethereum.stackexchange.com/questions/142022/how-many-transfer-events-are-there-in-ethereum)

Enfin, `blockStep` découpe la recherche en plages de blocs afin d’éviter les limites imposées par certains RPC publics. Tu peux le réduire à `2_000` ou `5_000` si ton fournisseur RPC refuse les requêtes trop larges.

> Structure event log ERC20 transfert avec Ethers.js

La structure d’un log d’événement `Transfer` ERC20 dans ethers.js suit exactement le format standard des logs Ethereum, avec des champs `address`, `topics`, `data`, etc., et ethers ajoute une couche de parsing pour te donner les arguments décodus (`from`, `to`, `value`). [docs.ethers](https://docs.ethers.org/v4/api-contract.html)

## 1. Définition de l’événement ERC20

Dans la norme ERC20, l’événement est défini ainsi :

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

- `from` et `to` sont `indexed` → ils vont dans les `topics`.
- `value` n’est pas `indexed` → il va dans `data`. [ethereum](https://ethereum.org/developers/tutorials/logging-events-smart-contracts/)

La signature de l’événement (hashée) est :

```text
Transfer(address,address,uint256)
```

et son keccak256 est le premier `topic` du log. [docs.ethers](https://docs.ethers.org/v6/single-page/)

## 2. Structure brute du log (niveau JSON-RPC)

Un log tel que renvoyé par `provider.getLogs()` ou dans un `transactionReceipt.logs` ressemble à :

```ts
{
  address: string;              // adresse du contrat ERC20
  topics: string[];             // tableau de 3 topics pour Transfer ERC20
  data: string;                 // données non-indexées (ici: value)
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
}
```

Pour un `Transfer` ERC20 standard :

- `topics[0]` = `keccak256("Transfer(address,address,uint256)")`
- `topics [docs.ethers](https://docs.ethers.org/v4/api-contract.html)` = `from` (adressé, 32 octets, left-padded)
- `topics [docs.ethers](https://docs.ethers.org/v6/single-page/)` = `to` (adressé, 32 octets, left-padded)
- `data` = `value` encodé sur 32 octets (uint256) [docs.ethers](https://docs.ethers.org/v6/single-page/)

Exemple concret (valeurs factices) :

```ts
{
  address: "0xTokenContract...",
  topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // Transfer signature
    "0x000000000000000000000000FromAddress.....................",
    "0x000000000000000000000000ToAddress......................."
  ],
  data: "0x00000000000000000000000000000000000000000000000000000000000La structure d’un log d’événement `Transfer` ERC20 dans ethers.js suit exactement le format standard des logs Ethereum, avec des champs `address`, `topics`, `data`, etc., et ethers ajoute une couche de parsing pour te donner les arguments décodus (`from`, `to`, `value`).  [docs.ethers](https://docs.ethers.org/v6/single-page/)

## 1. Définition de l’événement ERC20

Dans la norme ERC20, l’événement est défini ainsi :

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

- `from` et `to` sont `indexed` → ils vont dans les `topics`.
- `value` n’est pas `indexed` → il va dans `data`.  [ethereum](https://ethereum.org/developers/tutorials/logging-events-smart-contracts/)

La signature de l’événement (hashée) est :

```text
Transfer(address,address,uint256)
```

et son keccak256 est le premier `topic` du log.  [dev](https://dev.to/nazhmudin/transactions-data-decoding-and-human-readable-visualisation-elj)

## 2. Structure brute du log (niveau JSON-RPC)

Un log tel que renvoyé par `provider.getLogs()` ou dans un `transactionReceipt.logs` ressemble à :

```ts
{
  address: string;              // adresse du contrat ERC20
  topics: string[];             // tableau de 3 topics pour Transfer ERC20
  data: string;                 // données non-indexées (ici: value)
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
}
```

Pour un `Transfer` ERC20 standard :

- `topics[0]` = `keccak256("Transfer(address,address,uint256)")`
- `topics [docs.ethers](https://docs.ethers.org/v4/api-contract.html)` = `from` (adressé, 32 octets, left-padded)
- `topics [docs.ethers](https://docs.ethers.org/v6/single-page/)` = `to` (adressé, 32 octets, left-padded)
- `data` = `value` encodé sur 32 octets (uint256)  [dev](https://dev.to/nazhmudin/transactions-data-decoding-and-human-readable-visualisation-elj)

Exemple concret (valeurs factices) :

```ts
{
  address: "0xTokenContract...",
  topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // Transfer signature
    "0x000000000000000000000000FromAddress.....................",
    "0x000000000000000000000000ToAddress......................."
  ],
  data: "0x00000000000000000000000000000000000000000000000000000000000f4240" // 1_000_000
}
```

## 3. Comment ethers.js expose ce log

### a) Via un contrat (`Contract`) et un listener

Avec ethers v5/v6, si tu as un contrat ERC20 :

```ts
const contract = new ethers.Contract(address, ERC20_ABI, provider);

contract.on("Transfer", (from, to, value, event) => {
  // from, to, value sont déjà décodés
  // event est l’objet log enrichi
});
```

L’objet `event` (ou `log` selon la version) contient typiquement :

```ts
{
  address: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;

  topics: string[];
  data: string;

  // Ajouté par ethers après parsing
  args: [from: string, to: string, value: bigint];
  event: "Transfer";
  eventSignature: "Transfer(address,address,uint256)";

  // Fonctions utilitaires
  getBlock: () => Promise<Block>;
  getTransaction: () => Promise<TransactionResponse>;
  getTransactionReceipt: () => Promise<TransactionReceipt>;
}
```

C’est exactement ce que décrit la doc ethers pour les “Event Objects”.  [docs.ethers](https://docs.ethers.org/v6/single-page/)

### b) Via `provider.getLogs()` + `parseLog`

Si tu récupères des logs bruts :

```ts
const logs = await provider.getLogs({
  address: tokenAddress,
  topics: [ethers.id("Transfer(address,address,uint256)")]
});

const iface = new ethers.Interface(ERC20_ABI);

const parsed = logs.map(log => iface.parseLog({
  topics: log.topics,
  data: log.data
}));
// parsed[i].args = { from, to, value }
```

Ici, `log` a la structure JSON-RPC décrite plus haut, et `parseLog` renvoie un objet avec `args` contenant `from`, `to`, `value`.  [github](https://github.com/ethers-io/ethers.js/discussions/4045)

## 4. Récapitulatif de la structure “log Transfer ERC20” dans ethers.js

En résumé, pour un `Transfer` ERC20 :

- Niveau brut (JSON-RPC) :

```ts
{
  address: string;
  topics: [
    signatureHash,      // Transfer(address,address,uint256)
    fromPadded,         // 32 bytes
    toPadded            // 32 bytes
  ];
  data: valuePadded;    // 32 bytes (uint256)
  blockNumber, blockHash, transactionHash, logIndex, ...
}
```

La structure d’un log d’événement `Transfer` ERC20 dans ethers.js suit exactement le format standard des logs Ethereum, avec des champs `address`, `topics`, `data`, etc., et ethers ajoute une couche de parsing pour te donner les arguments décodus (`from`, `to`, `value`).  [docs.ethers](https://docs.ethers.org/v6/single-page/)

## 1. Définition de l’événement ERC20

Dans la norme ERC20, l’événement est défini ainsi :

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

- `from` et `to` sont `indexed` → ils vont dans les `topics`.
- `value` n’est pas `indexed` → il va dans `data`.  [ethereum](https://ethereum.org/developers/tutorials/logging-events-smart-contracts/)

La signature de l’événement (hashée) est :

```text
Transfer(address,address,uint256)
```

et son keccak256 est le premier `topic` du log.  [dev](https://dev.to/nazhmudin/transactions-data-decoding-and-human-readable-visualisation-elj)

## 2. Structure brute du log (niveau JSON-RPC)

Un log tel que renvoyé par `provider.getLogs()` ou dans un `transactionReceipt.logs` ressemble à :

```ts
{
  address: string;              // adresse du contrat ERC20
  topics: string[];             // tableau de 3 topics pour Transfer ERC20
  data: string;                 // données non-indexées (ici: value)
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
}
```

Pour un `Transfer` ERC20 standard :

- `topics[0]` = `keccak256("Transfer(address,address,uint256)")`
- `topics [docs.ethers](https://docs.ethers.org/v4/api-contract.html)` = `from` (adressé, 32 octets, left-padded)
- `topics [docs.ethers](https://docs.ethers.org/v6/single-page/)` = `to` (adressé, 32 octets, left-padded)
- `data` = `value` encodé sur 32 octets (uint256)  [dev](https://dev.to/nazhmudin/transactions-data-decoding-and-human-readable-visualisation-elj)

Exemple concret (valeurs factices) :

```ts
{
  address: "0xTokenContract...",
  topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // Transfer signature
    "0x000000000000000000000000FromAddress.....................",
    "0x000000000000000000000000ToAddress......................."
  ],
  data: "0x00000000000000000000000000000000000000000000000000000000000f4240" // 1_000_000
}
```

## 3. Comment ethers.js expose ce log

### a) Via un contrat (`Contract`) et un listener

Avec ethers v5/v6, si tu as un contrat ERC20 :

```ts
const contract = new ethers.Contract(address, ERC20_ABI, provider);

contract.on("Transfer", (from, to, value, event) => {
  // from, to, value sont déjà décodés
  // event est l’objet log enrichi
});
```

L’objet `event` (ou `log` selon la version) contient typiquement :

```ts
{
  address: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;

  topics: string[];
  data: string;

  // Ajouté par ethers après parsing
  args: [from: string, to: string, value: bigint];
  event: "Transfer";
  eventSignature: "Transfer(address,address,uint256)";

  // Fonctions utilitaires
  getBlock: () => Promise<Block>;
  getTransaction: () => Promise<TransactionResponse>;
  getTransactionReceipt: () => Promise<TransactionReceipt>;
}
```

C’est exactement ce que décrit la doc ethers pour les “Event Objects”.  [docs.ethers](https://docs.ethers.org/v6/single-page/)

### b) Via `provider.getLogs()` + `parseLog`

Si tu récupères des logs bruts :

```ts
const logs = await provider.getLogs({
  address: tokenAddress,
  topics: [ethers.id("Transfer(address,address,uint256)")]
});

const iface = new ethers.Interface(ERC20_ABI);

const parsed = logs.map(log => iface.parseLog({
  topics: log.topics,
  data: log.data
}));
// parsed[i].args = { from, to, value }
```

Ici, `log` a la structure JSON-RPC décrite plus haut, et `parseLog` renvoie un objet avec `args` contenant `from`, `to`, `value`.  [github](https://github.com/ethers-io/ethers.js/discussions/4045)

## 4. Récapitulatif de la structure “log Transfer ERC20” dans ethers.js

En résumé, pour un `Transfer` ERC20 :

- Niveau brut (JSON-RPC) :

```ts
{
  address: string;
  topics: [
    signatureHash,      // Transfer(address,address,uint256)
    fromPadded,         // 32 bytes
    toPadded            // 32 bytes
  ];
  data: valuePadded;    // 32 bytes (uint256)
  blockNumber, blockHash, transactionHash, logIndex, ...
}
```

- Niveau ethers (après parsing via contrat ou `Interface.parseLog`) :

```ts
{
  address,
  topics,
  data,
  blockNumber,
  transactionHash,
  ...
  args: {
    from: string;
    to: string;
    value: bigint;
  },
  event: "Transfer",
  eventSignature: "Transfer(address,address,uint256)"
}
```

Si tu veux, je peux te montrer un snippet complet en TypeScript (ethers v6) pour écouter et parser ces logs dans un backend Express.

> snippet complet en TypeScript (ethers v5) pour écouter et parser ces logs dans un backend Express

Voici un exemple complet en ethers v5 pour écouter et parser les logs `Transfer` ERC20, avec la structure exacte de l’objet d’événement. [docs.ethers](https://docs.ethers.org/v5/api/contract/example/)

## Setup de base (provider + contrat)

```ts
import { ethers } from "ethers";
import erc20Abi from "./erc20Abi.json"; // ABI standard ERC20

// Provider (Infura, Alchemy, RPC custom, etc.)
const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/XXX");

// Adresse du token ERC20
const tokenAddress = "0xYourTokenAddress";

// Contrat ethers v5
const erc20 = new ethers.Contract(tokenAddress, erc20Abi, provider);
```

## 1. Listener direct sur l’événement `Transfer`

Avec v5, tu peux directement écouter l’événement par son nom : [docs.ethers](https://docs.ethers.org/v5/api/contract/example/)

```ts
erc20.on("Transfer", (from, to, value, event) => {
  console.log("from:", from);
  console.log("to:", to);
  console.log("value (BigNumber):", value.toString());

  // Structure du log/evenement complet
  console.log("event object:", event);
});
```

Dans ce callback :

- `from: string` → adresse source.
- `to: string` → adresse destination.
- `value: ethers.BigNumber` → montant transféré.
- `event` est l’objet `Event` d’ethers, qui wrappe le log brut. [docs.ethers](https://docs.ethers.org/v5/api/contract/example/)

Structure typique de `event` (type `Event` / `EventLog` en v5) :

```ts
{
  // champs du log JSON-RPC
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;

  // champs ajoutés par ethers
  args: [from: string, to: string, value: ethers.BigNumber];
  event: string;               // "Transfer"
  eventSignature: string;      // "Transfer(address,address,uint256)"
  decode: (data, topics) => any;
  getBlock: () => Promise<ethers.providers.Block>;
  getTransaction: () => Promise<ethers.providers.TransactionResponse>;
  getTransactionReceipt: () => Promise<ethers.providers.TransactionReceipt>;
}
```

Tu peux accéder aux args via :

```ts
erc20.on("Transfer", (...args) => {
  const event = args[args.length - 1]; // dernier param = event
  if ("args" in event) {
    console.log("event.args:", event.args); // { from, to, value }
  }
});
``` 

C’est précisément la façon recommandée de lire `log.args` en v5. [docs.ethers](https://docs.ethers.org/v4/api-contract.html)

## 2. Listener avec filtre personnalisé (topics / adresse)

Si tu veux un filtrage fin (par ex. uniquement les transferts vers une adresse donnée) : [docs.ethers](https://docs.ethers.org/v5/)

```ts
const toAddress = "0xYourWallet";

const filterTo = {
  address: tokenAddress,
  topics: [
    ethers.utils.id("Transfer(address,address,uint256)"), // topic[0] = signature
    null,                                                // from (on ne filtre pas)
    ethers.utils.hexZeroPad(toAddress, 32)               // to (filtré)
  ]
};

erc20.on(filterTo, (from, to, value, event) => {
  console.log("Transfer vers moi:", { from, to, value: value.toString() });
});
```

Ici, la structure des logs est identique, mais tu utilises un `Filter` explicite :

- `topics[0]` : hash de `Transfer(address,address,uint256)`. [docs.ethers](https://docs.ethers.org/v5/)
- `topics [docs.ethers](https://docs.ethers.org/v5/api/contract/example/)` : adresse `from` padded sur 32 octets.
- `topics [docs.ethers](https://docs.ethers.org/v5/concepts/events/)` : adresse `to` padded sur 32 octets.
- `data` : `value` encodé sur 32 octets (uint256). [ethereum.stackexchange](https://ethereum.stackexchange.com/questions/87643/how-to-listen-to-contract-events-using-ethers-js)

## 3. Récupérer les logs bruts + parse manuellement

Tu peux aussi passer par `provider.getLogs()` puis parser avec `Interface` :

```ts
const iface = new ethers.utils.Interface(erc20Abi);

const filter = {
  address: tokenAddress,
  topics: [ethers.utils.id("Transfer(address,address,uint256)")],
  fromBlock: 17000000,
  toBlock: "latest"
};

const logs = await provider.getLogs(filter);

for (const log of logs) {
  // log a la structure JSON-RPC pure
  // { address, topics, data, blockNumber, transactionHash, ... }

  const parsed = iface.parseLog(log);

  console.log("from:", parsed.args.from);
  console.log("to:", parsed.args.to);
  console.log("value:", parsed.args.value.toString());

  console.log("raw log:", log);
}
```

- `log` → structure brute des logs Ethereum.
- `parsed` (`LogDescription`) → `name`, `signature`, `args` décodés. [docs.ethers](https://docs.ethers.org/v4/api-contract.html)

***

Si tu veux, je peux te proposer une version typée en TypeScript (avec `type EventTransfer = { from: string; to: string; value: BigNumber; }`) et un petit service prêt à plugger dans un backend Node/Express pour streamer les transferts ERC20.

> Comment typer les transferts ERC20 avec TypeScript

Voici une façon propre et typée de manipuler les transferts ERC20 en TypeScript avec ethers v5, sans outil externe (TypeChain, etc.), tout en gardant un bon typage. [docs.ethers](https://docs.ethers.org/v5/single-page/)

## 1. Types de base pour un transfert ERC20

```ts
import { BigNumber, Event, Log } from "@ethersproject/providers";
Voici une façon propre et typée de manipuler les transferts ERC20 en TypeScript avec ethers v5, sans outil externe (TypeChain, etc.), tout en gardant un bon typage. [22][26][27]

## 1. Types de base pour un transfert ERC20

```ts
import { BigNumber, Event, Log } from "@ethersproject/providers";
import type { Contract } from "@ethersproject/contracts";

// Arguments décodus de l'événement Transfer
export interface ERC20TransferArgs {
  from: string;
  to: string;
  value: BigNumber;
}

// Wrapper pratique autour de Event pour Transfer
export interface ERC20TransferEvent {
  // Champs du log brut
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;

  // Champs ethers
  args: ERC20TransferArgs;
  event: "Transfer";
  eventSignature: string;

  // Helpers (optionnels, selon ce que tu utilises)
  getBlock: () => Promise<any>;
  getTransaction: () => Promise<any>;
  getTransactionReceipt: () => Promise<any>;
}
```

En pratique, tu n’as pas besoin de redéfinir tous les champs si tu utilises directement le type `Event` d’ethers ; tu peux juste typer les `args` : [22]

```ts
import type { Event } from "@ethersproject/contracts";
import type { BigNumber } from "@ethersproject/bignumber";

export interface ERC20TransferArgs {
  from: string;
  to: string;
  value: BigNumber;
}

export type ERC20TransferEvent = Event & {
  args: ERC20TransferArgs;
  event: "Transfer";
};
```

## 2. Typage du listener avec ethers v5

Avec un contrat ERC20 typé “manuellement” :

```ts
import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import type { ERC20TransferEvent, ERC20TransferArgs } from "./erc20-types";

const erc20Abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  // ... autres fonctions ERC20
] as const;

export class ERC20Contract {
  public readonly contract: Contract;

  constructor(address: string, provider: Provider) {
    this.contract = new Contract(address, erc20Abi, provider);
  }

  // Listener typé sur Transfer
  public onTransfer(
    cb: (from: string, to: string, value: BigNumber, event: ERC20TransferEvent) => void
  ): void {
    // ethers v5 accepte (from, to, value, event) pour un event non-anonyme
    this.contract.on("Transfer", cb as any);
  }

  // Variante avec filtre (ex: uniquement les transferts vers une adresse)
  public onTransferTo(
    to: string,
    cb: (from: string, to: string, value: BigNumber, event: ERC20TransferEvent) => void
  ): void {
    const filter = this.contract.filters.Transfer(null, to);
    this.contract.on(filter, cb as any);
  }
}
```

Usage :

```ts
const erc20 = new ERC20Contract(tokenAddress, provider);

erc20.onTransfer((from, to, value, event) => {
  // `event.args` est typé ERC20TransferArgs
  const args: ERC20TransferArgs = event.args;

  console.log("Transfer:", {
    from: args.from,
    to: args.to,
    value: value.toString(),
    block: event.blockNumber,
    tx: event.transactionHash,
  });
});
```

Le `as any` sur le callback est nécessaire car ethers v5 n’a pas de types TS très stricts sur les listeners d’événements, mais à l’intérieur tu gardes un typage fort sur `args`. [22][25]

## 3. Typage des logs bruts + `parseLog`

Si tu passes par `provider.getLogs()` et `Interface.parseLog` :

```ts
import { Interface } from "@ethersproject/abi";
import type { Log } from "@ethersproject/providers";
import type { ERC20TransferArgs } from "./erc20-types";

const iface = new Interface(erc20Abi);

export function parseERC20TransferLog(log: Log): ERC20TransferArgs {
  const parsed = iface.parseLog(log);

  // parsed.name === "Transfer"
  // parsed.args est un objet { from, to, value } + array
  return {
    from: parsed.args.from as string,
    to: parsed.args.to as string,
    value: parsed.args.value as any, // BigNumber
  };
}
```

Tu peux ajouter un type plus précis pour `parsed` si tu veux :

```ts
import type { LogDescription } from "@ethersproject/abi";

export function parseERC20TransferLogTyped(log: Log): {
  parsed: LogDescription & { args: ERC20TransferArgs };
} {
  const parsed = iface.parseLog(log) as LogDescription & { args: ERC20TransferArgs };
  return { parsed };
}
```

## 4. Avec TypeChain (optionnel, mais très propre)

Si tu veux du typage entièrement généré (recommandé pour un gros projet), tu peux utiliser TypeChain avec la cible `ethers-v5` : [24][26][27]

```bash
npm i -D typechain @typechain/ethers-v5
npx typechain --input ./abis/ERC20.json --target ethers-v5
```

Cela génère un fichier `ERC20.ts` avec :

- `ERC20` : type du contrat.
- `ERC20Interface` : interface typée.
- `ERC20Filters` : `filters.Transfer(...)`.
- Types pour les événements : `TransferEvent`, `TransferEventFilter`, etc. [26][27]

Exemple d’usage généré :

```ts
import { ERC20__factory } from "./types/ERC20";
import type { TransferEvent } from "./types/ERC20";

const erc20 = ERC20__factory.connect(tokenAddress, provider);

erc20.on("Transfer", (from, to, value, event: TransferEvent) => {
  // event.args est déjà typé { from: string, to: string, value: BigNumber }
});
```

---

Si tu veux, je peux te fournir un petit module complet (fichiers `erc20-types.ts`, `erc20-service.ts`) prêt à intégrer dans un backend NestJS/Express avec TypeScript.

> pour ether.js v6

Voici une version propre et typée pour ethers v6, avec les types officiels (`EventLog`, `ContractEvent`, etc.) et un exemple concret pour les transferts ERC20. [docs.ethers](https://docs.ethers.org/v6/getting-started/)

## 1. Types de base pour un transfert ERC20 (ethers v6)

En v6, les logs d’événements sont représentés par `EventLog`, qui étend `Log` et ajoute `args`, `eventName`, `eventSignature`, etc. [docs.ethers](https://docs.ethers.org/v5/concepts/events/)

```ts
import type { EventLog } from "ethers";

// Arguments décodus de l'événement Transfer
export interface ERC20TransferArgs {
  from: string;
  to: string;
  value: bigint;
}

// Type pratique pour un log Transfer ERC20
export type ERC20TransferEventLog = EventLog & {
  args: ERC20TransferArgs;
  eventName: "Transfer";
};
```

`EventLog` contient déjà tous les champs du log brut (`address`, `topics`, `data`, `blockNumber`, `transactionHash`, etc.) + les champs parsés. [docs.ethers](https://docs.ethers.org/v5/concepts/events/)

## 2. ABI minimal et contrat typé “manuellement”

```ts
import { Contract, Provider } from "ethers";
import type { ERC20TransferEventLog, ERC20TransferArgs } from "./Voici une version propre et typée pour ethers v6, avec les types officiels (`EventLog`, `ContractEvent`, etc.) et un exemple concret pour les transferts ERC20. [33][34][40]

## 1. Types de base pour un transfert ERC20 (ethers v6)

En v6, les logs d’événements sont représentés par `EventLog`, qui étend `Log` et ajoute `args`, `eventName`, `eventSignature`, etc. [34][40]

```ts
import type { EventLog } from "ethers";

// Arguments décodus de l'événement Transfer
export interface ERC20TransferArgs {
  from: string;
  to: string;
  value: bigint;
}

// Type pratique pour un log Transfer ERC20
export type ERC20TransferEventLog = EventLog & {
  args: ERC20TransferArgs;
  eventName: "Transfer";
};
```

`EventLog` contient déjà tous les champs du log brut (`address`, `topics`, `data`, `blockNumber`, `transactionHash`, etc.) + les champs parsés. [34]

## 2. ABI minimal et contrat typé “manuellement”

```ts
import { Contract, Provider } from "ethers";
import type { ERC20TransferEventLog, ERC20TransferArgs } from "./erc20-types";

const erc20Abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)",
] as const;

export class ERC20Contract {
  public readonly contract: Contract;

  constructor(address: string, provider: Provider) {
    this.contract = new Contract(address, erc20Abi, provider);
  }

  /**
   * Listener typé sur tous les Transfer
   * Callback: (from, to, value, event)
   */
  public onTransfer(
    cb: (
      from: string,
      to: string,
      value: bigint,
      event: ERC20TransferEventLog
    ) => void
  ): void {
    // En v6, le dernier param est toujours un EventPayload (ici EventLog)
    this.contract.on("Transfer", cb as any);
  }

  /**
   * Listener filtré, ex: uniquement les transferts vers `to`
   */
  public onTransferTo(
    to: string,
    cb: (
      from: string,
      to: string,
      value: bigint,
      event: ERC20TransferEventLog
    ) => void
  ): void {
    const filter = this.contract.filters.Transfer(null, to);
    this.contract.on(filter, cb as any);
  }
}
```

Le `as any` est nécessaire car les overloads de `contract.on` en v6 ne sont pas parfaitement typés pour les events nommés, mais à l’intérieur du callback tu gardes un typage fort. [33][34]

## 3. Usage du listener

```ts
import { JsonRpcProvider } from "ethers";
import { ERC20Contract } from "./erc20-contract";
import type { ERC20TransferEventLog } from "./erc20-types";

const provider = new JsonRpcProvider("https://mainnet.infura.io/v3/XXX");
const tokenAddress = "0xYourTokenAddress";

const erc20 = new ERC20Contract(tokenAddress, provider);

erc20.onTransfer((from, to, value, event) => {
  // event est typé ERC20TransferEventLog
  const args: ERC20TransferArgs = event.args;

  console.log("Transfer:", {
    from: args.from,
   Voici une version propre et typée pour ethers v6, avec les types officiels (`EventLog`, `ContractEvent`, etc.) et un exemple concret pour les transferts ERC20. [docs.ethers](https://docs.ethers.org/v6/getting-started/)

## 1. Types de base pour un transfert ERC20 (ethers v6)

En v6, les logs d’événements sont représentés par `EventLog`, qui étend `Log` et ajoute `args`, `eventName`, `eventSignature`, etc. [docs.ethers](https://docs.ethers.org/v5/concepts/events/)

```ts
import type { EventLog } from "ethers";

// Arguments décodus de l'événement Transfer
export interface ERC20TransferArgs {
  from: string;
  to: string;
  value: bigint;
}

// Type pratique pour un log Transfer ERC20
export type ERC20TransferEventLog = EventLog & {
  args: ERC20TransferArgs;
  eventName: "Transfer";
};
```

`EventLog` contient déjà tous les champs du log brut (`address`, `topics`, `data`, `blockNumber`, `transactionHash`, etc.) + les champs parsés. [docs.ethers](https://docs.ethers.org/v5/concepts/events/)

## 2. ABI minimal et contrat typé “manuellement”

```ts
import { Contract, Provider } from "ethers";
import type { ERC20TransferEventLog, ERC20TransferArgs } from "./erc20-types";

const erc20Abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)",
] as const;

export class ERC20Contract {
  public readonly contract: Contract;

  constructor(address: string, provider: Provider) {
    this.contract = new Contract(address, erc20Abi, provider);
  }

  /**
   * Listener typé sur tous les Transfer
   * Callback: (from, to, value, event)
   */
  public onTransfer(
    cb: (
      from: string,
      to: string,
      value: bigint,
      event: ERC20TransferEventLog
    ) => void
  ): void {
    // En v6, le dernier param est toujours un EventPayload (ici EventLog)
    this.contract.on("Transfer", cb as any);
  }

  /**
   * Listener filtré, ex: uniquement les transferts vers `to`
   */
  public onTransferTo(
    to: string,
    cb: (
      from: string,
      to: string,
      value: bigint,
      event: ERC20TransferEventLog
    ) => void
  ): void {
    const filter = this.contract.filters.Transfer(null, to);
    this.contract.on(filter, cb as any);
  }
}
```

Le `as any` est nécessaire car les overloads de `contract.on` en v6 ne sont pas parfaitement typés pour les events nommés, mais à l’intérieur du callback tu gardes un typage fort. [docs.ethers](https://docs.ethers.org/v6/getting-started/)

## 3. Usage du listener

```ts
import { JsonRpcProvider } from "ethers";
import { ERC20Contract } from "./erc20-contract";
import type { ERC20TransferEventLog } from "./erc20-types";

const provider = new JsonRpcProvider("https://mainnet.infura.io/v3/XXX");
const tokenAddress = "0xYourTokenAddress";

const erc20 = new ERC20Contract(tokenAddress, provider);

erc20.onTransfer((from, to, value, event) => {
  // event est typé ERC20TransferEventLog
  const args: ERC20TransferArgs = event.args;

  console.log("Transfer:", {
    from: args.from,
    to: args.to,
    value: value.toString(),
    block: event.blockNumber,
    tx: event.transactionHash,
    logIndex: event.logIndex,
  });

  // Accès au log brut si besoin
  const rawLog = event.log; // EventLog complet
});
```

Dans ce callback :

- `from`, `to`, `value` sont déjà déréférencés (params de l’event).
- `event` est un `EventLog` avec :
  - `event.args` → `{ from, to, value }`
  - `event.eventName` → `"Transfer"`
  - `event.eventSignature` → `"Transfer(address,address,uint256)"`
  - `event.log` → le `EventLog` complet (champs `address`, `topics`, `data`, etc.). [docs.ethers](https://docs.ethers.org/v6/getting-started/)

## 4. Logs bruts + `Interface.parseLog` (v6)

Si tu récupères des logs via `provider.getLogs` et que tu veux les parser toi-même :

```ts
import { Interface, Provider } from "ethers";
import type { Log } from "ethers";
import type { ERC20TransferArgs } from "./erc20-types";

const iface = new Interface(erc20Abi);

export function parseERC20TransferLog(log: Log): ERC20TransferArgs {
  const parsed = iface.parseLog({
    topics: log.topics,
    data: log.data,
  });

  // parsed.name === "Transfer"
  // parsed.args est { from,Voici une version propre et typée pour ethers v6, avec les types officiels (`EventLog`, `ContractEvent`, etc.) et un exemple concret pour les transferts ERC20. [33][34][40]

## 1. Types de base pour un transfert ERC20 (ethers v6)

En v6, les logs d’événements sont représentés par `EventLog`, qui étend `Log` et ajoute `args`, `eventName`, `eventSignature`, etc. [34][40]

```ts
import type { EventLog } from "ethers";

// Arguments décodus de l'événement Transfer
export interface ERC20TransferArgs {
  from: string;
  to: string;
  value: bigint;
}

// Type pratique pour un log Transfer ERC20
export type ERC20TransferEventLog = EventLog & {
  args: ERC20TransferArgs;
  eventName: "Transfer";
};
```

`EventLog` contient déjà tous les champs du log brut (`address`, `topics`, `data`, `blockNumber`, `transactionHash`, etc.) + les champs parsés. [34]

## 2. ABI minimal et contrat typé “manuellement”

```ts
import { Contract, Provider } from "ethers";
import type { ERC20TransferEventLog, ERC20TransferArgs } from "./erc20-types";

const erc20Abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)",
] as const;

export class ERC20Contract {
  public readonly contract: Contract;

  constructor(address: string, provider: Provider) {
    this.contract = new Contract(address, erc20Abi, provider);
  }

  /**
   * Listener typé sur tous les Transfer
   * Callback: (from, to, value, event)
   */
  public onTransfer(
    cb: (
      from: string,
      to: string,
      value: bigint,
      event: ERC20TransferEventLog
    ) => void
  ): void {
    // En v6, le dernier param est toujours un EventPayload (ici EventLog)
    this.contract.on("Transfer", cb as any);
  }

  /**
   * Listener filtré, ex: uniquement les transferts vers `to`
   */
  public onTransferTo(
    to: string,
    cb: (
      from: string,
      to: string,
      value: bigint,
      event: ERC20TransferEventLog
    ) => void
  ): void {
    const filter = this.contract.filters.Transfer(null, to);
    this.contract.on(filter, cb as any);
  }
}
```

Le `as any` est nécessaire car les overloads de `contract.on` en v6 ne sont pas parfaitement typés pour les events nommés, mais à l’intérieur du callback tu gardes un typage fort. [33][34]

## 3. Usage du listener

```ts
import { JsonRpcProvider } from "ethers";
import { ERC20Contract } from "./erc20-contract";
import type { ERC20TransferEventLog } from "./erc20-types";

const provider = new JsonRpcProvider("https://mainnet.infura.io/v3/XXX");
const tokenAddress = "0xYourTokenAddress";

const erc20 = new ERC20Contract(tokenAddress, provider);

erc20.onTransfer((from, to, value, event) => {
  // event est typé ERC20TransferEventLog
  const args: ERC20TransferArgs = event.args;

  console.log("Transfer:", {
    from: args.from,
    to: args.to,
    value: value.toString(),
    block: event.blockNumber,
    tx: event.transactionHash,
    logIndex: event.logIndex,
  });

  // Accès au log brut si besoin
  const rawLog = event.log; // EventLog complet
});
```

Dans ce callback :

- `from`, `to`, `value` sont déjà déréférencés (params de l’event).
- `event` est un `EventLog` avec :
  - `event.args` → `{ from, to, value }`
  - `event.eventName` → `"Transfer"`
  - `event.eventSignature` → `"Transfer(address,address,uint256)"`
  - `event.log` → le `EventLog` complet (champs `address`, `topics`, `data`, etc.). [33][34][40]

## 4. Logs bruts + `Interface.parseLog` (v6)

Si tu récupères des logs via `provider.getLogs` et que tu veux les parser toi-même :

```ts
import { Interface, Provider } from "ethers";
import type { Log } from "ethers";
import type { ERC20TransferArgs } from "./erc20-types";

const iface = new Interface(erc20Abi);

export function parseERC20TransferLog(log: Log): ERC20TransferArgs {
  const parsed = iface.parseLog({
    topics: log.topics,
    data: log.data,
  });

  // parsed.name === "Transfer"
  // parsed.args est { from, to, value } + accès par index
  return {
    from: parsed.args as string,
    to: parsed.args as string,
    value: parsed.args as bigint,
  };
}
```

Avec v6, `parseLog` renvoie un objet de type `LogDescription` avec `name`, `signature`, `args`. [34]

## 5. Avec TypeChain (optionnel, très propre en v6)

Si tu veux du typage entièrement généré, TypeChain a une cible `ethers-v6` : [37]

```bash
npm i -D typechain @typechain/ethers-v6
npx typechain --input ./abis/ERC20.json --target ethers-v6
```

Tu obtiens un fichier `ERC20.ts` avec :

- `ERC20` : type du contrat.
- `TransferEvent` : type de l’événement.
- `TransferEventFilter`, etc.

Exemple d’usage généré :

```ts
import { ERC20__factory } from "./types/ERC20";
import type { TransferEvent } from "./types/ERC20";

const erc20 = ERC20__factory.connect(tokenAddress, provider);

erc20.on("Transfer", (from, to, value, event) => {
  // event est typé par TypeChain, event.args est déjà { from, to, value }
});
```

---

Si tu veux, je peux te fournir un mini-package TypeScript (fichiers `erc20-types.ts`, `erc20-contract.ts`, `erc20-listener.ts`) prêt à coller dans un projet NestJS/Express avec ethers v6.

> Peux-tu me générer la fonction Typescript "export const getERC20TransfertLogs = async (provider: Provider, tokenAddress: string) : Promise<Array<ERC20TransferArgs>>" qui récupére les logs de la fonction "transfert()" d'ERC20 à partir de la fonction "provider.getLogs()" de ether.js v6 et qui utilise la fonction "parseERC20TransferLog()" ci-dessus pour extraire les arguments des logs ?

Voici la fonction `getERC20TransfertLogs` qui récupère les logs de transfert ERC20 et les parse avec ta fonction existante :

```ts
import { Interface, Provider, Log } from "ethers";
import STABLECOIN_ABI from '../../abis/Stablecoin.json';
import { parseERC20TransferLog, type ERC20TransferArgs } from './erc20logs_parser';

const iface = new Interface(STABLECOIN_ABI);

// Signature de l'événement Transfer (topic0)
// keccak256("Transfer(address,address,uint256)")
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export const getERC20TransfertLogs = async (
  provider: Provider,
  tokenAddress: string
): Promise<Array<ERC20TransferArgs>> => {
  // Récupérer les logs avec le filtre sur l'événement Transfer
  const logs = await provider.getLogs({
    address: tokenAddress,
    topics: [TRANSFER_TOPIC],
  });

  // Parser chaque log et extraire les arguments
  const transferEvents: ERC20TransferArgs[] = [];

  for (const log of logs) {
    try {
      const args = parseERC20TransferLog(log);
      transferEvents.push(args);
    } catch (error) {
      // Ignorer les logs qui ne peuvent pas être parsés (mauvais format, etc.)
      console.warn('Failed to parse log:', log, error);
    }
  }

  return transferEvents;
};
```

***

## Version alternative avec `Promise.all` (plus concise)

```ts
export const getERC20TransfertLogs = async (
  provider: Provider,
  tokenAddress: string
): Promise<Array<ERC20TransferArgs>> => {
  const logs = await provider.getLogs({
    address: tokenAddress,
    topics: [TRANSFER_TOPIC],
  });

  return logs
    .map((log) => {
      try {
        return parseERC20TransferLog(log);
      } catch {
        return null;
      }
    })
    .filter((args): args is ERC20TransferArgs => args !== null);
};
```

***

## Exemple d'utilisation

```ts
import { ethers } from "ethers";
import { getERC20TransfertLogs } from './erc20logs_parser';

const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_API_KEY');
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI

const transfers = await getERC20TransfertLogs(provider, tokenAddress);

transfers.forEach(({ from, to, value }) => {
  console.log(`Transfer: ${from} -> ${to}, value: ${value}`);
});
```

***

## Notes

- **`topics: [TRANSFER_TOPIC]`** : Filtre uniquement les événements `Transfer` (topic0 = signature hash de l'événement). [stackoverflow](https://stackoverflow.com/questions/20235491/including-jquery-mobile-locally-in-android-app)
- **`address: tokenAddress`** : Limite la recherche au contrat ERC20 spécifié.
- **Gestion d'erreurs** : Les logs malformés sont ignorés avec un `console.warn` pour ne pas faire échouer toute la requête.
- **Signature de Transfer** : `keccak256("Transfer(address,address,uint256)")` = `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`. [www-db.deis.unibo](http://www-db.deis.unibo.it/courses/TW/DOCS/w3schools/jquerymobile/jquerymobile_get_started.asp.html)


> Comment intégrer JQuery mobile ?

Pour intégrer **jQuery Mobile** (je suppose que c’est bien *jQuery Mobile* et non *jsquery-mobile*) dans ta vue EJS avec Express.js et TypeScript, tu as deux options principales :

1. **Via CDN** (recommandé pour un prototypage rapide)
2. **En local** (si tu veux héberger les fichiers toi-même)

Voici comment faire dans les deux cas.

***

## Option 1 : Intégration via CDN (recommandée)

Ajoute simplement les liens CDN dans le `<head>` de ton fichier EJS :

```ejs
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Home</title>

  <!-- jQuery Mobile CSS -->
  <link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />

  <!-- jQuery (requis par jQuery Mobile) -->
  <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>

  <!-- jQuery Mobile JS -->
  <script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
</head>
<body>
  <h1>tableau de bord des adresses</h1>
  
  <p>Ether.js version: <%= etherjs_version %></p>
  
  <table border="1">
    <thead>
      <tr>
        <th>Adress</th>
        <th>ETH Balance</th>
        <th><a href="/stablecoin"><%= erc20_symbol %></a> Balance</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <% adressAndBalanceList.forEach(([adress, eth_balance, erc20_balance]) => { %>
        <tr>
          <td><%= adress %></td>
          <td><%= eth_balance %></td>
          <td><%= erc20_balance %></td>
          <td><p><a href="/mint?to=<%= adress %>">Mint</a> - <a href="/transfert?from=<%= adress %>">Transfert</a></p></td>
        </tr>
      <% }) %>
    </tbody>
  </table>

</body>
</html>
```

***

## Option 2 : Intégration en local

Si tu veux héberger les fichiers toi-même :

1. Télécharge les fichiers depuis [jquerymobile.com/download](https://jquerymobile.com/download/)
2. Place-les dans un dossier `public` de ton projet Express, par exemple :
   ```
   public/
     css/
       jquery.mobile-1.4.5.min.css
     js/
       jquery-1.11.1.min.js
       jquery.mobile-1.4.5.min.js
   ```
3. Assure-toi que ton serveur Express sert les fichiers statiques :
   ```ts
   import express from 'express';
   import path from 'path';

   const app = express();
   app.use(express.static(path.join(__dirname, '../public')));
   ```
4. Dans ton EJS :
   ```ejs
   <link rel="stylesheet" href="/css/jquery.mobile-1.4.5.min.css" />
   <script src="/js/jquery-1.11.1.min.js"></script>
   <script src="/js/jquery.mobile-1.4.5.min.js"></script>
   ```

***

## Remarques

- jQuery Mobile est un projet **archivé** (plus maintenu activement), mais toujours fonctionnel pour des interfaces mobiles simples. [github](https://github.com/jquery-archive/jquery-mobile)
- La version stable la plus récente est **1.4.5**. [releases.jquery](https://releases.jquery.com/)
- Le `<meta name="viewport">` est important pour le rendu mobile correct. [www-db.deis.unibo](http://www-db.deis.unibo.it/courses/TW/DOCS/w3schools/jquerymobile/jquerymobile_get_started.asp.html)

Si tu voulais parler d’une autre bibliothèque nommée exactement `jsquery-mobile`, merci de préciser — je n’ai trouvé aucune référence à ce nom dans les sources publiques.

> feuille de style minimal pour améliorer le rendu des vues ?

Voici une feuille de style **minimaliste mais efficace** pour améliorer le rendu de ta vue EJS, avec un design moderne, lisible et responsive.

***

## 1. Fichier CSS (`public/css/style.css`)

```css
/* Reset basique */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

p {
  margin-bottom: 20px;
  text-align: center;
}

table {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

thead {
  background: #3498db;
  color: #fff;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

tbody tr:hover {
  background: #f1f1f1;
}

tbody tr:last-child td {
  border-bottom: none;
}

a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 600px) {
  th, td {
    padding: 10px;
    font-size: 14px;
  }

  h1 {
    font-size: 1.5rem;
  }
}
```

***

## 2. Vue EJS mise à jour

```ejs
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Home</title>
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
  <h1>Tableau de bord des adresses</h1>
  
  <p>Ether.js version: <%= etherjs_version %></p>
  
  <table>
    <thead>
      <tr>
        <th>Adresse</th>
        <th>ETH Balance</th>
        <th><a href="/stablecoin"><%= erc20_symbol %></a> Balance</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <% adressAndBalanceList.forEach(([adress, eth_balance, erc20_balance]) => { %>
        <tr>
          <td><%= adress %></td>
          <td><%= eth_balance %></td>
          <td><%= erc20_balance %></td>
          <td>
            <a href="/mint?to=<%= adress %>">Mint</a>
            <span> - </span>
            <a href="/transfert?from=<%= adress %>">Transfert</a>
          </td>
        </tr>
      <% }) %>
    </tbody>
  </table>
</body>
</html>
```

***

## 3. Configuration Express.js (TypeScript)

Assure-toi que ton serveur sert les fichiers statiques :

```ts
import express from 'express';
import path from 'path';

const app = express();

// Dossier public pour les fichiers statiques (CSS, JS, images...)
app.use(express.static(path.join(__dirname, '../public')));

// ... le reste de ta config (routes, EJS, etc.)
```

Structure de projet recommandée :

```
project/
├─ public/
│  └─ css/
│     └─ style.css
├─ views/
│  └─ home.ejs
└─ src/
   └─ index.ts
```

***

## Résultat

- Tableau propre avec en-tête coloré
- Effet de survol sur les lignes
- Design responsive (mobile-friendly)
- Typographie moderne et lisible
- Ombre portée subtile pour le tableau

Tu peux bien sûr personnaliser les couleurs (`#3498db`, `#2c3e50`, etc.) selon ta charte graphique.

> version compléte de la CSS ?

Voici la feuille de style mise à jour avec des styles pour les **zones de saisie** (`<input>`, `<textarea>`, `<select>`) et les **boutons** (`<button>`, `<input type="button|submit">`).

***

## Feuille de style complète (`public/css/style.css`)

```css
/* Reset basique */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

p {
  margin-bottom: 20px;
  text-align: center;
}

table {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

thead {
  background: #3498db;
  color: #fff;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

tbody tr:hover {
  background: #f1f1f1;
}

tbody tr:last-child td {
  border-bottom: none;
}

a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

/* Zones de saisie */
input[type="text"],
input[type="number"],
input[type="email"],
input[type="password"],
input[type="url"],
input[type="search"],
textarea,
select {
  width: 100%;
  max-width: 400px;
  padding: 10px 14px;
  font-size: 16px;
  font-family: inherit;
  color: #333;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus,
input[type="number"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
input[type="url"]:focus,
input[type="search"]:focus,
textarea:focus,
select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

input[type="text"]::placeholder,
input[type="number"]::placeholder,
input[type="email"]::placeholder,
input[type="password"]::placeholder,
input[type="url"]::placeholder,
input[type="search"]::placeholder,
textarea::placeholder {
  color: #aaa;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

/* Boutons */
button,
input[type="button"],
input[type="submit"],
input[type="reset"] {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  font-family: inherit;
  font-weight: 500;
  color: #fff;
  background: #3498db;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

button:hover,
input[type="button"]:hover,
input[type="submit"]:hover,
input[type="reset"]:hover {
  background: #2980b9;
}

button:active,
input[type="button"]:active,
input[type="submit"]:active,
input[type="reset"]:active {
  transform: scale(0.98);
}

button:disabled,
input[type="button"]:disabled,
input[type="submit"]:disabled,
input[type="reset"]:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

/* Variantes de boutons (optionnel) */
.btn-primary {
  background: #3498db;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-success {
  background: #27ae60;
}

.btn-success:hover {
  background: #219a52;
}

.btn-warning {
  background: #f39c12;
}

.btn-warning:hover {
  background: #d68910;
}

.btn-danger {
  background: #e74c3c;
}

.btn-danger:hover {
  background: #c0392b;
}

/* Responsive */
@media (max-width: 600px) {
  th, td {
    padding: 10px;
    font-size: 14px;
  }

  h1 {
    font-size: 1.5rem;
  }

  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  input[type="url"],
  input[type="search"],
  textarea,
  select,
  button,
  input[type="button"],
  input[type="submit"],
  input[type="reset"] {
    width: 100%;
    max-width: 100%;
  }
}
```

***

## Exemple d'utilisation dans une vue EJS

```ejs
<form action="/mint" method="POST">
  <label for="address">Adresse :</label>
  <input type="text" id="address" name="address" placeholder="0x..." required />

  <label for="amount">Montant :</label>
  <input type="number" id="amount" name="amount" min="0" step="0.0001" required />

  <button type="submit">Mint</button>
  <button type="reset" class="btn-warning">Annuler</button>
</form>

<!-- Boutons avec variantes -->
<button class="btn-success">Confirmer</button>
<button class="btn-danger">Supprimer</button>
```

***

## Points clés

- **Inputs** : bordure subtile, effet de focus avec ombre bleue, placeholder gris
- **Boutons** : fond bleu, hover plus foncé, effet de clic (`scale(0.98)`)
- **Variantes** : classes utilitaires `.btn-primary`, `.btn-success`, `.btn-warning`, `.btn-danger`
- **Responsive** : inputs et boutons prennent 100% de la largeur sur mobile

Tu n'as plus qu'à copier-coller ce CSS dans ton fichier `style.css` !

> Avec Express.js et Typescript, comment itérer sur un tableau dans une vue EJS ?

Avec EJS, tu itères sur un tableau exactement comme en JavaScript normal, mais à l’intérieur des balises `<% %>` dans ta vue.

## Syntaxe de base

Dans ta route Express :

```ts
// route.ts
res.render('index', {
  items: ['a', 'b', 'c'],
});
```

Dans ta vue `views/index.ejs` :

```ejs
<ul>
  <% for (const item of items) { %>
    <li><%= item %></li>
  <% } %>
</ul>
```

ou avec `forEach` :

```ejs
<ul>
  <% items.forEach((item) => { %>
    <li><%= item %></li>
  <% }); %>
</ul>
```

## Avec des objets (tableau d’objets)

Si tu passes un tableau d’objets :

```ts
res.render('products', {
  products: [
    { id: 1, name: 'Produit 1', price: 10 },
    { id: 2, name: 'Produit 2', price: 20 },
  ],
});
```

Tu peux faire :

```ejs
<table>
  <thead>
    <tr>
      <th>Nom</th>
      <th>Prix</th>
    </tr>
  </thead>
  <tbody>
    <% products.forEach((product) => { %>
      <tr>
        <td><%= product.name %></td>
        <td><%= product.price %> €</td>
      </tr>
    <% }); %>
  </tbody>
</table>
```

## Avec l’index (si besoin)

```ejs
<% items.forEach((item, index) => { %>
  <p><%= index + 1 %>. <%= item %></p>
<% }); %>
```

## Points clés de syntaxe EJS

- `<% code %>` : exécute du JS (boucles, conditions, etc.) sans afficher directement.
- `<%= expression %>` : affiche le résultat échappé (sécurisé contre XSS).
- `<%- expression %>` : affiche le résultat **non échappé** (HTML brut, à utiliser avec précaution).

Si tu veux, je peux te montrer un exemple complet avec Express + TypeScript (setup du projet, types, route, et vue EJS).


> Récupération de la date d'un block dans les logs ?

La date n’est pas directement contenue dans un log Ethereum : un log possède notamment `blockNumber` et `blockHash`. Il faut donc récupérer le bloc correspondant, puis convertir son `timestamp` Unix en `Date`. En ethers.js v6, `log.getBlock()` permet de récupérer directement ce bloc. [docs.ethers](https://docs.ethers.org/v6/api/providers/)

```ts
import {
  EventLog,
  Interface,
  Log,
} from "ethers";

export interface ERC20TransferArgs {
  from: string;
  to: string;
  value: bigint;
}

export interface ERC20TransferEvent extends ERC20TransferArgs {
  date: Date;
  timestamp: number;
  blockNumber: number;
  blockHash: string;
}

const iface = new Interface(STABLECOIN_ABI);

export async function parseERC20TransferLog(
  log: Log
): Promise<ERC20TransferEvent> {
  const parsed = iface.parseLog({
    topics: log.topics,
    data: log.data,
  });

  if (!parsed || parsed.name !== "Transfer") {
    throw new Error("Invalid Transfer log");
  }

  const from = parsed.args[0] as string;
  const to = parsed.args [docs.ethers](https://docs.ethers.org/v6/api/providers/) as string;
  const value = parsed.args [docs.ethers](https://docs.ethers.org/v6-beta/api/providers/formatting/) as bigint;

  const block = await log.getBlock();

  if (!block) {
    throw new Error(`Block not found: ${log.blockHash}`);
  }

  return {
    from,
    to,
    value,
    date: new Date(block.timestamp * 1000),
    timestamp: block.timestamp,
    blockNumber: log.blockNumber,
    blockHash: log.blockHash,
  };
}
```

Utilisation :

```ts
const transfer = await parseERC20TransferLog(log);

console.log(transfer);
// {
//   from: "0x...",
//   to: "0x...",
//   value: 1000000000000000000n,
//   date: 2026-08-17T12:34:56.000Z,
//   timestamp: 1786960496,
//   blockNumber: 12345678,
//   blockHash: "0x..."
// }
```

## Variante avec un `Provider`

Si votre objet `Log` ne dispose pas de `getBlock()` — par exemple si vous avez reconstruit manuellement le log — utilisez un provider :

```ts
import { JsonRpcProvider, Log } from "ethers";

const provider = new JsonRpcProvider(process.env.RPC_URL);

export async function parseERC20TransferLog(
  log: Log
): Promise<ERC20TransferEvent> {
  const parsed = iface.parseLog({
    topics: log.topics,
    data: log.data,
  });

  if (!parsed || parsed.name !== "Transfer") {
    throw new Error("Invalid Transfer log");
  }

  const block = await provider.getBlock(log.blockHash);

  if (!block) {
    throw new Error(`Block not found: ${log.blockHash}`);
  }

  return {
    from: parsed.args[0] as string,
    to: parsed.args [docs.ethers](https://docs.ethers.org/v6/api/providers/) as string,
    value: parsed.args [docs.ethers](https://docs.ethers.org/v6-beta/api/providers/formatting/) as bigint,
    date: new Date(block.timestamp * 1000),
    timestamp: block.timestamp,
    blockNumber: log.blockNumber,
    blockHash: log.blockHash,
  };
}
```

Il est préférable d’utiliser `blockHash` plutôt que seulement `blockNumber` pour récupérer le bloc, car une réorganisation de chaîne peut remplacer le bloc situé à cette hauteur. [docs.ethers](https://docs.ethers.org/v6/api/providers/)

## Attention à la signification de la date

Cette date est la date du **bloc qui contient l’événement**, et non une date stockée par le contrat ni nécessairement l’instant exact où le transfert a été exécuté. Le timestamp d’un bloc est exprimé en secondes depuis Unix epoch ; il faut donc le multiplier par `1000` pour le convertir en millisecondes JavaScript. [docs.ethers](https://docs.ethers.org/v6/api/providers/)

Si vous préférez retourner une chaîne ISO plutôt qu’un objet `Date` :

```ts
date: new Date(block.timestamp * 1000).toISOString(),
```

et modifiez l’interface :

```ts
export interface ERC20TransferEvent extends ERC20TransferArgs {
  date: string;
  timestamp: number;
  blockNumber: number;
  blockHash: string;
}
```

> Avec Typescript et Ether.js v6, quels sont les arguments à donner à la fonction "provider.getLogs()" pour récupérer les événements ERC20 "transfert" pour le jeton d'adresse "tokenAddress" et en provenance de "fromAddress" ?

Pour récupérer les événements ERC‑20 `Transfer` émis par le contrat `tokenAddress` et dont le champ `from` vaut `fromAddress`, passez à `provider.getLogs()` un filtre contenant :

- `address` : l’adresse du contrat ERC‑20 ;
- `topics[0]` : le hash de la signature `Transfer(address,address,uint256)` ;
- `topics [docs.ethers](https://docs.ethers.org/v6/api/providers/)` : l’adresse source encodée sur 32 octets.

En ethers.js v6 :

```ts
import { ethers } from "ethers";

const transferTopic = ethers.id(
  "Transfer(address,address,uint256)"
);

const logs = await provider.getLogs({
  address: tokenAddress,
  topics: [
    transferTopic,
    ethers.zeroPadValue(fromAddress, 32),
  ],
});
```

Le filtre correspond à :

```ts
{
  address: tokenAddress,
  topics: [
    keccak256("Transfer(address,address,uint256)"),
    bytes32(fromAddress),
  ],
}
```

`Transfer` est défini ainsi dans l’interface ERC‑20 :

```solidity
event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
);
```

Les paramètres `from` et `to` étant `indexed`, ils se trouvent respectivement dans `topics [docs.ethers](https://docs.ethers.org/v6/api/providers/)` et `topics [docs.ethers](https://docs.ethers.org/v5/concepts/events/)`; la valeur `value`, non indexée, se trouve dans `log.data`. [docs.ethers](https://docs.ethers.org/v6/api/providers/)

## Avec une plage de blocs

Il est généralement préférable de limiter la recherche :

```ts
const logs = await provider.getLogs({
  fromBlock: 18_000_000,
  toBlock: "latest",
  address: tokenAddress,
  topics: [
    ethers.id("Transfer(address,address,uint256)"),
    ethers.zeroPadValue(fromAddress, 32),
  ],
});
```

Selon le RPC utilisé, une plage trop large peut être refusée ou limitée. Dans ce cas, découpez la recherche en intervalles de blocs.

## Décoder les événements

`getLogs()` retourne des objets `Log` bruts. Pour décoder `to` et `value` :

```ts
const erc20Interface = new ethers.Interface([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

for (const log of logs) {
  const parsed = erc20Interface.parseLog({
    topics: log.topics,
    data: log.data,
  });

  if (parsed) {
    console.log({
      from: parsed.args.from,
      to: parsed.args.to,
      value: parsed.args.value, // bigint
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
    });
  }
}
```

`value` est retourné sous forme de `bigint` en ethers.js v6.

### Variante avec `Interface.encodeFilterTopics()`

Pour éviter d’encoder manuellement l’adresse :

```ts
const iface = new ethers.Interface([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

const logs = await provider.getLogs({
  address: tokenAddress,
  topics: iface.encodeFilterTopics("Transfer", [fromAddress]),
});
```

Cette variante produit le même filtre : événement `Transfer` du contrat `tokenAddress`, avec `from == fromAddress`.

> Même question, mais je veux les événements ERC20 "transfert" du jeton d'adresse "tokenAddress" à destination de l'adresse "toAddress" ?

Pour récupérer les événements ERC‑20 `Transfer` émis par `tokenAddress` et dont le champ `to` vaut `toAddress`, filtrez le troisième topic, car `to` est le deuxième paramètre `indexed` de l’événement. [docs.chainstack](https://docs.chainstack.com/recipes/how-to-properly-encode-topics-for-eth_getlogs-1)

```ts
import { ethers } from "ethers";

const logs = await provider.getLogs({
  address: tokenAddress,
  topics: [
    ethers.id("Transfer(address,address,uint256)"),
    null, // from : n'importe quelle adresse
    ethers.zeroPadValue(toAddress, 32), // to
  ],
});
```

La structure du filtre est donc :

```ts
{
  address: tokenAddress,
  topics: [
    keccak256("Transfer(address,address,uint256)"),
    null,
    bytes32(toAddress),
  ],
}
```

Dans l’événement ERC‑20 :

```solidity
event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
);
```

- `topics[0]` : signature de l’événement ;
- `topics [docs.chainstack](https://docs.chainstack.com/recipes/how-to-properly-encode-topics-for-eth_getlogs-1)` : adresse `from` ;
- `topics [docs.chainstack](https://docs.chainstack.com/docs/ethereum-logs-tutorial-series-logs-and-filters)` : adresse `to` ;
- `log.data` : montant `value`.

## Variante avec `Interface`

Vous pouvez laisser ethers.js encoder l’adresse :

```ts
const iface = new ethers.Interface([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

const logs = await provider.getLogs({
  address: tokenAddress,
  topics: iface.encodeFilterTopics("Transfer", [
    null,
    toAddress,
  ]),
});
```

## Décodage des logs

```ts
for (const log of logs) {
  const parsed = iface.parseLog({
    topics: log.topics,
    data: log.data,
  });

  if (parsed) {
    console.log({
      from: parsed.args.from,
      to: parsed.args.to,
      value: parsed.args.value, // bigint
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber,
    });
  }
}
```

Avec une plage de blocs :

```ts
const logs = await provider.getLogs({
  fromBlock: 18_000_000,
  toBlock: "latest",
  address: tokenAddress,
  topics: [
    ethers.id("Transfer(address,address,uint256)"),
    null,
    ethers.zeroPadValue(toAddress, 32),
  ],
});
```

`null` signifie ici « ne pas filtrer ce topic » : tous les expéditeurs sont donc acceptés.
