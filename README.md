# ProjetGraphQLD3JsAmirathRomain

# Introduction
Ce projet contient une pile de containers permettant de lancer une visualisation de données de ventes, étudiées pendant la première partie d'une UE de base de donnée avancées sur les datawarehouse.

 La pile de containers comprend :      
 
 - une base de données MongoDB contenant les données de ventes
 - un serveur Apache,    
 - un container GraphQL contenant le code du serveur et les résolveurs.

Pour lancer la pile: 
```
docker-compose up -d
```
Pour ouvrir rapidement toutes les pages web des containers pour le dev:
```
sh openfirefox.sh
```
Pour arrêter la pile: 
```
docker-compose down
```