# Widgets
Introduction widgets ....
FAIRE ATTENTION A ETRE EN FULLSCREEN NAVIGATEUR

## ElementWidget

ElementWidget est une widget abstraite fournissant un ensemble d'interactions tactiles et tangibles. Cette widget est de forme rectangulaire, et la nature de son contenu (image, vidéo, texte, ...) doit être définit dans une classe héritant d'ElementWidget. Le type de contenu compatible ne se limite uniquement à sa possibilité d'implementation en HTML.


| Nombre de doigts         | Effet           |
| ------------- |:-------------:|
| 1 doigt      | Mouvement de la widget  |
| 2 doigts      | Rotation + Resize    |
| 5 doigts | Suppression      |


Concernant les interactions tangibles, ce sont les mêmes que celles disponibles en tactiles. L'association du tag et de l'interaction se fait via le constructeur de la widget.

Les fonctions disponibles pour toutes les ElementWidgets sont : 
```typescript
canRotate(canRotateTangible, canRotateTactile);
canMove(canMoveTangible, canMoveTactile);
canZoom(canZoomTangible, canZoomTactile);
canDelete(canDeleteTangible, canDeleteTactile);
disable(isDisabled);
```

Tous les paramètres de ces fonctions sont des booléens.
Elles permettant d'activer/désactiver certaines fonctionnalités des widgets en fonction des interactions tactiles et tangibles, voir même de tout désactiver avec la fonction `disable()`.


### ImageElementWidget

La première implémentation d'ElementWidget (ImageElementWidget) permet d'afficher tout type d'image compatible avec la balise `<img>` d'HTML5. 

#### Constructeur
```typescript
constructor(x, y, width, height, initialRotation, initialScale, src, tagMove, tagDelete, tagZoom);
```
    
 
 Il faut faire attention à ce que la taille de l'image corresponde bien aux dimensions width et height passées en paramètre.

#### Exemple d'utilisation
```javascript
const candiesImage = new ImageElementWidget(100, 150, 110, 110, 0, 1, 'assets/example-health/candies.png', 'B3', 'C9', '38');
$('#app').append(candiesImage.domElem);
```
Les formats d'images pris en comptes sont tous ceux compatibles avec la balise `<img>` HTML5 et pris en charge par le navigateur utilisé. 


### VideoElementWidget

Une deuxième implémentation d'ElementWidget (VideoElementWidget) concerne l'affichage de vidéo. Comme ImageElementWidget, les vidéos compatible avec cette widget sont les formats supportés par la balise `<video>` d'HTML5.

#### Constructeur 
```javascript
constructor(x, y, width, height, initialRotation, initialScale, src, tagMove, tagDelete, tagZoom, tagPlayPause)
```
#### Example d'utilisation
```javascript
const videoWidget = new VideoElementWidget(100, 100, 250, 140, 0, 1, 'assets/video/video.mp4', 'B3', 'C9', '38', '3');
```
En plus des fonctions disponibles via `ElementWidget`, VideoElementWidget dispose de `canPlayPause(canPlayPauseTangible)` permettant d'action/désactiver le play/pause via un tag.


## CircularMenu

Widget représentant un menu de manière circulaire lors de la pose d'un tag sur la table.
La structure interne du menu est un arbre. Cette particularité permet d'avoir une infinité de sous-menus, sous-sous-menus, ...

Le menu affiche donc à chaque fois tous les fils du noeud sur lequel on se trouve. Si on clique sur un menu possédant un ou plusieurs fils, on actualise le menu pour afficher son/ses fils et on ajoute un bouton retour pour remonter dans l'arbre.
Pour mettre en place le menu circulaire, il y a deux classes présentes : `MenuItem` et `CircularMenu`. La première définit un noeud de l'arbre, et la seconde définit le menu dans sa globalité.

#### Constructeurs

```javascript
/**
 * Constructor MenuItem
 *
 * @method onTagDeletion
 * @param {string} item - Text of the menu item OR class of the icon
 * @param {string} backgroundcolor - Hexadecimal of background color
 * @param {string} color - Hexadecimal of text/icon color
 * @param {boolean} isIcon - Define if the item is a text or an icon
 */
constructor(item, backgroundcolor, color, isIcon);
```
```javascript
/**
 * Constructor CircularMenu
 *
 * @method onTagDeletion
 * @param {string} tagMenu - Text for back button
 * @param {MenuItem} rootTree - Root of the menu tree
 */
constructor(tagMenu, rootTree)
```

#### Example d'utilisation
```javascript
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
```

On construit dans un premier temps les feuilles de l'arbre avec les objets `MenuItem`. Le premier argument definit soit le texte affiché pour l'item du menu, soit la classe d'une icône pour une balise \<i> (font-awesome, bootstrap, ...). Le deuxième argument définit la couleur de fond de l'item, le troisième argument la couleur du texte/icône, et enfin le dernier paramètre est un booleen pour savoir si c'est une icône ou non. Enfin, on definit l'action de Touch sur un item du menu avec la fonction `setTouchCallback()`. Il est inutile d'utiliser cette fonction pour les noeuds de l'arbre qui ne sont pas des feuilles.

```javascript
const difficulties = new MenuItem('Difficultés', '#FFF', '#000', false);
difficulties.addChild(facile);
difficulties.addChild(moyen);
const icones = new MenuItem('Icones', '#FFF', '#000', false);
icones.addChild(cloud);
const root = new MenuItem('root', '', '', false);
root.addChild(difficulties);
root.addChild(icones);
const circularmenu = new CircularMenu('6D', root);
```

On definit ensuite les noeuds de l'arbre toujours avec `MenuItem`. On ne définit cette fois pas les callback pour ces noeuds mais on ajoute les fils définit précedemment avec `addChild()` pour définir les sous-menus. On finit par définir la racine de l'arbre avec les premiers items du menus. Enfin, on créé le l'objet `CircularMenu` en lui passant en paramètre le tag associé ainsi que l'arbre créé.

<p align="center"> 
    <img src="images/menuResultF.png">
</p>

L'item retour est un item par défaut, mais on peut cependant le personnaliser.
```javascript
/**
 * Set Back button to an icon
 *
 * @method setBackMenuItemIcon
 * @param {string} iconClass - Icon class
 * @param {string} iconColor - Hexadecimal of icon color
 * @param {string} backgroundColor - Hexadecimal of background color
 */
setBackMenuItemIcon(iconClass, iconColor, backgroundColor)

/**
 * Set back button to a Text
 *
 * @method onTagDeletion
 * @param {string} text - Text for back button
 * @param {string} textColor - Hexadecimal of text color
 * @param {string} backgroundColor - Hexadecimal of background color
 */
setBackMenuItemText(text, textColor, backgroundColor)
```
On peut donc appelé ces fonctions sur `CicrularMenu` pour définir le bouton retour soit en tant qu'icône soit en tant que texte.

Le nombre d'items pour le menu est cependant limité. Actuellement, il est n'est pas possible d'afficher plus de 8 items simultanément sinon les items se superposent. Ainsi, le nombre d'items est limité à 8 pour la racine de l'arbre, et 7 pour tous les autres noeuds (car présence de l'item retour).
