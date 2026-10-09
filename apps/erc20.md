* standrad ERC 

** Qu'est-ce que l'ERC-20 ?

L'ERC-20 introduit une norme pour l'implémentation des jetons fongibles dans l'écosystème Ethereum. Un jeton fongible est un jeton interchangeable avec un autre jeton du même type.
Elle fournit des fonctionnalités de base pour le transfert de jetons et permet également leur approbation afin qu'ils puissent être dépensés par un tiers sur la blockchain.

Elle se décompose en :

1. Description du token (name, symbol, decimals et totalSupply)
2. Fonction de récupération du solde d'une adresse (balanceOf)
3. Fonction de transfert direct depuis l'adresse possédant les jetons (transfert)
4. Systéme d'autorisation et transfert depuis une autre adresse (autorisation, transfertFrom)


** liens utiles :

- https://fr.wikipedia.org/wiki/ERC20
- https://ethereum.org/fr/developers/docs/standards/tokens/erc-20/
- https://eips.ethereum.org/EIPS/eip-20
- https://docs.openzeppelin.com/contracts/4.x/api/token/erc20

** API

- function name() public view returns (string)

Retourne le nom du token (facultatif)

- function symbol() public view returns (string)

Retourne le symbol du token (facultatif)

- function decimals() public view returns (uint8)

Retourne le nombre de décimal utilisé par le jeton (facultatif)

- function totalSupply() public view returns (uint256)

Retourne le nombre total de jeton en circulation  (obligatoire)

- function balanceOf(address _owner) public view returns (uint256 balance)

Retourne le nombe de jeton possédé par l'adresse '_owner' (obligatoire)

- function transfer(address _to, uint256 _value) public returns (bool success)

L'appelant transfert '_value' de ses tokens à l'adresse '_to' (obligatoire)

- function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)

L'appelant transfert '_value' tokens de '_from' à l'adresse '_to' (obligatoire)
L'adresse '_from' doit avoir autoriser l'appelant à transfert '_value' tokens via la fonction 'approve()

- function approve(address _spender, uint256 _value) public returns (bool success)

L'appelant autorise l'adresse '_spender' à transfert '_value' de ses tokens (obligatoire)

- function allowance(address _owner, address _spender) public view returns (uint256 remaining)

Retourne le nombre de token encore autorisé par '_owner' pour '_spender' (obligatoire)

** Logique de fonctionnement

- transfert directe depuis l'appelant :

token.transfert(adr_target, _amount) -> 'sender' transfert '_amount' de ses tokens à '_adr_target'

- transfert indirect :

token.approve(_spender, _amount) -> l'appelant autorise '_spender' à envoyer '_amount' de ses tokens 

token.transfertFrom(_owner, _to, _value) -> '_spender' envoie '_value' token de '_owner' à '_to'

