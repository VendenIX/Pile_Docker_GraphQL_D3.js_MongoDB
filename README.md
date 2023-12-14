# ProjetGraphQLD3JsAmirathRomain

# Introduction
Ce projet contient une pile de containers permettant de lancer une visualisation de données de ventes, étudiées pendant la première partie d'une UE de base de donnée avancées sur les datawarehouse.

 La pile de containers comprend :      
 
 - une base de données MongoDB contenant les données de ventes
 - un serveur Apache,    
 - un container GraphQL contenant le code du serveur et les résolveurs.

Lancer le serveur GraphQL, se placer dans le dossier 'graphql' :
```
npm init es6 --yes
npm install mongodb @apollo/server graphql --save  --no-bin-links
```
```
docker-compose -f stack.yml up -d
```
Ré-importer les données dans la base de données MongoDB
```
docker exec -i mongo-dev sh -c 'mongoimport -d dba -c sales --authenticationDatabase admin -u root -p example' < sales.bson
```
Pour lancer rapidement toutes les pages web:
```
sh openfirefox.sh
```
Pour arrêter la pile de containers :
```
docker-compose -f stack.yml down
```



## Si jamais il y a un problème de CORS
### Dans firefox:
Aller à l'URL suivante: about:config
security.fileuri.strict_origin_policy true -> false 

## Projet réalisé par:
- Romain Andres https://github.com/VendenIX
- Amirath Fara Orou Guidou https://github.com/Amirath6

