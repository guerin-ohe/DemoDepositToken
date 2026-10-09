* TODO :

## Adresse et Stablecoin

1. Afficher liste des adresses et solde Ether dans Home - ok
2. Afficher Solde ERC20 dans Home - ok
3. Refactoring Wrapper Stablecoin pour ajouter interface ERC20 - ok
4. Ajouter action Mint, Transfert depuis liste dans Home - ok
5. Rédiger papier sur ERC20 - ok

## Gestion du stablecoin

1. Afficher TotalSupply, pause/unpause, répartition par adresse - en cours
    - ajout vue stablecoin et lien depuis home - ok
    - affichage propriété - ok
    - affichage répartition - ok
    - ajouter methode paused() - ok
    - afichage statut - ok
    - lien de changement de statut - ok
    - ajouter le symbol dans la home - ok
2. Ajouter burn par adresse et event ERC20
    - supprimer methode inutile (update, initialeMint) - ok
    - burn par adresse (utiliser burnFrom(address account, uint256 amount) qui est publique) - ok
    - ajouter lien d'action burn() dans vue home ou stablecoin - ok
    - creuser pourquoi le burn fonctionne pas (owner ? burn autoriser ?) 
    - event ERC20 - vérifier qu'ils sont bien implémenter par l'implémentation ERC20 de Zeppelin ?
3. Rédiger papier sur stablecoin

## Deposit Token

1. Contrat Depisit Token - ok
2. Wrapper Deposit Token - ajouter setMinter ? / injecter dans constructeur - ok
3. Utility Deposit and co - ok
4. Intégration dans IHM - ok
5. Ajouter pause/unpause - ok
6. Test - en cours 
    - tester burn() - marche pour minter, corriger pour non minter - ok
    - tester log - ok 
7. archiver dans github
8. Papier Deposit Token



## Wallet

1. Refactoring Wallet multi-adresse
2. Ajouter gestion autorisation
3. Ajouter action : aprove(), deposit() et withdrw()
4. Rédiger papier sur wallet

## Autres

1. Mettre en place namespace au niveau model - ok
2. Positionner la vue par défaut - ok
3. Intégration feuille de syle (jquery mobile) ou feuille de style minimal - ok
4. renomer home en adresse - ok
5. Ajouter trace sur Adresse - ok
6. Ajouter console d'événement - ok
7. Simuler la gestion de la réserve
8. Voir signature des transactions - ok, les transactions du wrapper sont signés avec l'adresse appelante
9. rennomer mint() & burn() en deposit() & withdraw() - ok
10. améliorer le rendu - ok
11. reorganiser projet pour avoir contrat et ihm dans la même arborescente - ok
12. archiver dans github - ok
13. Revoir la gestion d'erreur dans les 2 wrappers (stablecoin/deposit) - ok
14. Aligner les implémentations Stablecoin / DepositToken - ok, Deposit / reste Stablecoin
15. Agréger dans home toutes fonctions : burn, %, total stablecoin - ok

16. Mettre en place une pseudo gestion de compte bancaire

