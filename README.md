# ProjetGraphQLD3JsAmirathRomain

# Introduction
Ce projet contient une pile de containers permettant de lancer une visualisation de données de ventes, étudiées pendant la première partie d'une UE de base de donnée avancées sur les datawarehouse.

 La pile de containers comprend :      
 
 - une base de données MongoDB contenant les données de ventes
 - un serveur Apache,    
 - un container GraphQL contenant le code du serveur et les résolveurs.

 Nous avons fait le choix d'utiliser React pour notre UI pour ce projet car on devait se remettre à jour avec react pour un autre projet en parallèle qui utilise OHIF une librairie de visualisation d'images médicales.

 Nous avons adapté le code du professeur qui utilisait D3 à react, qui contient un package D3. Nous nous sommes servi de ChatGPT pour faire cette adaptation et du savoir de Romain Andres acquéris pendant son stage dans une start-up à Paris pour le front react, tandis que Amirath Fara Orou-Guidou s'est occupée du back-end avec notemmment la mise en place de GraphQL, et de toutes les requêtes et des résolveurs.

 Pour aller plus loin dans ce projet dans le futur dans quelques années, on pourrait faire en sorte que l'utilisateur entre un prompt et que une IA génère une nouvelle visualisation de données en fonction de ce prompt. On pourrait aussi faire en sorte que l'utilisateur puisse choisir les données qu'il veut visualiser, et que l'IA génère une visualisation en fonction de ces données, en adaptant les requêtes graphQL.
# Pour le professeur, ou le client qui veut lancer la pile de containers:

Se placer dans le dossier racine du projet où se trouve le fichier stack.yml
Lancer les containers:
```
docker-compose -f stack.yml up -d --build                                                                                                                                           
```
Insérer les données présentes d'exemple du fichier sales.bson:
```
docker exec -i mongo-dev sh -c 'mongoimport -d bda -c sales --authenticationDatabase admin -u root -p example' < sales.bson
```

## Le front est accessible à l'url : localhost:83
## Le playground de GraphQL est accessible à l'url : localhost:4000
## L'inteface de gestion mongo est accessible à l'url : localhost:8081
# Pour le développement: 

## Lancer le serveur graphql en local
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
docker exec -i mongo-dev sh -c 'mongoimport -d bda -c sales --authenticationDatabase admin -u root -p example' < sales.bson
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

## Projet réalisé par


**Romain Andres**  
[![GitHub](https://img.shields.io/badge/GitHub-VendenIX-blue?style=flat-square&logo=github)](https://github.com/VendenIX)

**Amirath Fara Orou Guidou**  
[![GitHub](https://img.shields.io/badge/GitHub-Amirath6-blue?style=flat-square&logo=github)](https://github.com/Amirath6)


## Encadré par nos enseignants de l'université de Caen Normandie

**Bruno Zanuttini**  
https://zanuttini.users.greyc.fr/

**François Rioult**  