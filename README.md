# Pyramid 

![Alt text](https://raw.githubusercontent.com/xviniette/Pyramid/master/splash.png)

Pyramid est un jeu de plateforme où l'on doit réaliser un parcours le plus rapidement possible.

[Une vidéo](https://www.youtube.com/watch?v=XQ-hyYrXqfk "Vidéo youtube") d'un mod du jeu Counter-Strike dont on s'inspire.
## Capacités du personnage 
* Avancer
* Reculer
* Gauche
* Droite
* Sauter
* S'accroupir
* Orienter la vue (souris)

## Types de blocs
* Plateforme classique
* Plateforme rebond
* Plateforme checkpoint (Si on tombe, on réapparait sur cette plateforme)
* Plateforme finish
* Plateforme mortelle (Collision fait respawn le joueur à son dernier checkpoint

## Map
Une map est un fichier qui contient :
* La liste des informations des blocs de toute la map
* Les coordonnées X, Y, Z et l'orientation du joueur au départ.
* Le classement des meilleurs temps des joueurs
* Les informations sur la physics de la map :
    * Gravité
    * Vitesse
    * Friction

## Paramètres
 Le jeu doit permettre au joueur de changer certains paramètre pour un meilleur confort de jeu
 * La sensibilité de la souris x/y
 * Les touches

## Bonus 
Si le jeu fonctionne bien, nous souhaitons y ajouter une mécanique en ligne.