# Widgets
Introduction widgets ....
FAIRE ATTENTION A ETRE EN FULLSCREEN NAVIGATEUR

## ElementWidget

ElementWidget est une widget abstraite fournissant un ensemble d'interactions tactiles et tangibles. Cette widget est de forme rectangulaire, et la nature de son contenu (image, vidéo, texte, ...) doit être définit dans une classe héritant d'ElementWidget. Le type de contenu compatible ne se limite uniquement à sa possibilité d'implementation en HTML.

Nombre de doigts | Effet
- |:-: | -:
1 doigt | Mouvement de la widget 
2 doigts | Rotation + Resize 
5 doigts | Suppression


Concernant les interactions tangibles, ce sont les mêmes que celles disponibles en tactiles. L'association du tag et de l'interaction se fait via le constructeur de la widget.

Les fonction disponibles pour toutes les ElementWidgets sont : 
- canRotate(canRotateTangible, canRotateTactile)
- canMove(canMoveTangible, canMoveTactile)
- canZoom(canZoomTangible, canZoomTactile)
- canDelete(canDeleteTangible, canDeleteTactile)
- disable(isDisabled)

//APPROFONDIR DESCRIPTION FONCTIONS

### ImageElementWidget

La première implémentation d'ElementWidget (ImageElementWidget) permet d'afficher tout type d'image compatible avec la balise '\<img>' d'HTML5. 

Constructeur : constructor(x, y, width, height, initialRotation, src, tagMove, tagDelete, tagZoom)

Quels formats d'images sont pris en compte...



### VideoElementWidget

Une deuxième implémentation d'ElementWidget (VideoElementWidget) concerne l'affichage de vidéo. Comme ImageElementWidget, les vidéos compatible avec cette widget sont les formats supportés par la balise '\<video>' d'HTML5.

Constructeur : constructor(x, y, width, height, initialRotation, src, tagMove, tagDelete, tagZoom, tagPlayPause, tagVolume)

Example d'utilisation + image

Interactions supplémentaire : play/pause(uniquement tangible)


## CircularMenu

Widget représentant un menu de manière circulaire lors de la pose d'un tag sur la table.
La structure interne du menu est un arbre. Cette particularité permet d'avoir une infinité de sous-menus, sous-sous-menus, ...

// IMAGE DU MENU + SOUS-MENU AVEC BOUTON RETOUR

Le menu affiche donc à chaque fois tous les fils du noeud sur lequel on se trouve. Si on clique sur un menu possédant un ou plusieurs fils, on actualise le menu pour afficher son/ses fils et on ajoute un bouton retour pour remonter dans l'arbre.

    const facile = new MenuItem('Facile', '#2E7D32', '#FFF', false);
    facile.setTouchCallback(() => {
        // Do something
    });

    const moyen = new MenuItem('Moyen', '#D84315', '#FFF', false);
    moyen.setTouchCallback(() => {
        // Do something
    });

    const cloud = new MenuItem('fa fa-2x fa-cloud', '#c62828', '#fff', true);
    cloud.setTouchCallback(() => {
        // Do something
    }); 

On construit dans un premier temps les feuilles de l'arbre avec les objets `MenuItem`. Le premier argument definit soit le texte affiché pour l'item du menu, soit la classe d'une icône pour une balise \<i> (font-awesome, bootstrap, ...). Le deuxième argument définit la couleur de fond de l'item, le troisième argument la couleur du texte/icône, et enfin le dernier paramètre est un booleen pour savoir si c'est une icône ou non. Enfin, on definit l'action de Touch sur un item du menu avec la fonction `setTouchCallback()`. Il est inutile d'utiliser cette fonction pour les noeuds de l'arbre qui ne sont pas des feuilles.

    const difficulties = new MenuItem('Difficultés', '#FFF', '#000', false);
    difficulties.addChild(facile);
    difficulties.addChild(moyen);
    const icones = new MenuItem('Icones', '#FFF', '#000', false);
    icones.addChild(cloud);
    const root = new MenuItem('root', '', '', false);
    root.addChild(difficulties);
    root.addChild(icones);
    const circularmenu = new CircularMenu('6D', root);

On definit ensuite les noeuds de l'arbre toujours avec `MenuItem`. On ne définit cette fois pas les callback pour ces noeuds mais on ajoute les fils définit précedemment avec `addChild()` pour définir les sous-menus. On finit par définir la racine de l'arbre avec les premiers items du menus. Enfin, on créé le l'objet `CircularMenu` en lui passant en paramètre le tag associé ainsi que l'arbre créé.

//IMAGES RESULTAT

L'item retour est un item par défaut, mais on peut cependant le personnaliser.

    setBackMenuItemIcon(iconClass, iconColor, backgroundColor)
    setBackMenuItemText(text, textColor, backgroundColor)

On peut donc appelé ces fonctions sur `CicrularMenu` pour définir le bouton retour soit en tant qu'icône soit en tant que texte.

Le nombre d'items pour le menu est cependant limité. Actuellement, il est n'est pas possible d'afficher plus de 8 items simultanément sinon les items se superposent. Ainsi, le nombre d'items est limité à 8 pour la racine de l'arbre, et 7 pour tous les autres noeuds (car présence de l'item retour).
