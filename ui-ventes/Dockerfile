# Utilisez l'image de base officielle d'Apache
FROM httpd:2.4

# Copiez les fichiers de construction de l'application React dans le dossier où Apache sert les fichiers statiques
COPY ./build/ /usr/local/apache2/htdocs/

# Exposez le port 80 pour le trafic HTTP
#ATTENTION APASHE ECOUTE LE PORT 80 !!!
EXPOSE 80

# Le conteneur exécutera Apache en arrière-plan
CMD ["httpd-foreground"]
