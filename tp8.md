---
author:
- François Rioult
lang: fr
title: Bases de données avancées
subtitle: TP8
---
**L'intégralité de ces manipulations est à effectuer sur la VDI (bureau distant). Une fois les containers lancés, pensez à réinsérer les données dans la base !**

Nous terminons cette série de TP par la constitution d'une pile de container complète permettant d'exposer une application web de visualisation des données de ventes. Cette pile contiendra les containers suivants\ :

* un container `mongo` pour la base de données
* un container `mongo-express` pour visualiser la base de données
* un container `graphql` qui fera tourner le serveur `graphql`
* un container `apache` pour servir les pages web sur la machine physique.

# Pré-recquis

* télécharger l'[archive contenant le code de départ](https://ecampus.unicaen.fr/mod/resource/view.php?id=863146)
* dans le dossier `tp8`, démarrer la pile de containers en construisant les containers qui le nécessitent\ :
        docker-compose -f stack.yml up -d --build
* vous pouvez maintenant accéder à une page de l'application, par exemple <http://127.0.0.1/france.html>

# Configuration de la pile de containers

Le fichier de configuration `stack.yml` est le suivant\ :

```yml
version: "3.6" 

services:
  graphql:
    image: graphql
    ports:
      - 4000:4000
    links:
      - "mongo:mongodb"
    build:
      context: graphql
      dockerfile: Dockerfile

  apache:
        image: php:7.2-apache
        ports:
          - 80:80
        volumes:
          - ./ui/:/var/www/html
#       links:
#         - "graphql:graphql"
   
  mongo:
    image: mongo:7.0.2
    container_name: mongo-dev
    ports:
      - 27017:27017
    volumes:
      - mongodata:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example

  mongo-express:
    image: mongo-express:1.0.0
    depends_on:
      - mongo
    ports:
      - 8081:8081
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongo-dev
      - ME_CONFIG_MONGODB_ADMINUSERNAME=root
      - ME_CONFIG_MONGODB_ADMINPASSWORD=example
      - ME_CONFIG_BASICAUTH_USERNAME=root
      - ME_CONFIG_BASICAUTH_PASSWORD=example

volumes:
  mongodata:
```

On note quelques changement par rapport à la version du TP5 qui ne comprenait que les containers `mongo` et `mongo-express`\ :

* il y a maintenant un container `apache` pour servir les fichiers de l'application web. Ce container reçoit sur son port 80 les connexions depuis le port 80 de la machine hôte (ici la VDI). Il y a également un volume\ : `./ui/` sur la machine virtuelle qui correspond à `/var/www/html/` dans le container, qui est le répertoire où `apache` lit les fichiers qui seront liés à la racine du serveur.
* il a un container `graphql` accessible sur le port 4000. Ce container est construit à partir du contenu du répertoire `graphql` qui contient le code du TP6. La méthode de construction du container est décrite dans le fichier `Dockerfile`\ :

```
FROM node:18-alpine

COPY . /myapp

WORKDIR /myapp

RUN npm install

CMD [ "node", "index.js" ]
```

Ce fichier indique que\ :

* le container doit être construit à partir du container `node:14-alpine` qui contient l'interpréteur `node` en version 18, lui-même construit à partir de container `alpine`, qui est une distribution Linux minimale
* on copie ensuite le contenu du répertoire courant dans le répertoire `myapp` du container
* on se déplace dans ce répertoire
* on lance la commande `npm install`
* on définit enfin que le container va exécuter la commande `node index.js`

# Axes de développement

### Un premier axe concerne le développement des requêtes `graphQL`.

- éteindre la pile de containers
- désactiver le container `graphQL` de la pile Docker en commentant les lignes du service correspondant dans le fichier `stack.yml` à l'aide de caractères #
- il faut maintenant lancer le service `graphQL` directement sur la machine virtuelle. Dans le résolveur, modifier l'URL de connexion à MongoDB :

        const uri = 'mongodb://root:example@localhost:27017';

- effectuer le développement des requêtes en modifiant le schéma, les résolveurs et en utilisant le *playground* de `graphQL`

- lorsque le développement du connecteur `graphQL` est stable, modifier l'adresse IP du container `Mongo` dans le résolveur :

        const uri = 'mongodb://root:example@mongodb:27017';

- puis construisez le container :

        $ docker build -t graphql .

- vous pouvez maintenant l'intégrer à la pile

### Le deuxième axe concerne le développement des pages .HTML

Vous pouvez utiliser `D3.js` pour effectuer la visualisation des données obtenues par `graphQL`.
Pour cela, il peut être utile de pourvoir vos requêtes `graphQL` de paramètres. Entre autres, pour l'aggrégation, on pourra ajouter au pipeline une étape [`$match`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/).

```
// dans la feuille HTML
d3.json("http://localhost:4000/?query={prestationsByDpt(departement:14){description count}}").then(drawPrestation)

# dans model.graphql
type Query {
    prestationsByDpt(departement: Int): [Prestation]
    ...
}

// dans le résolveur
const resolvers = {
    Query: {
        prestationsByDpt(root, args, context) {
            // faire quelquechose avec
	    // ... args.department ...
```
