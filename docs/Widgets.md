# Widgets
Introduction widgets ....
FAIRE ATTENTION A ETRE EN FULLSCREEN NAVIGATEUR

## ElementWidget

La première Widget implémentées est ElementWidget. C'est une widget qui permet d'afficher un élément (pour l'instant image et vidéo) à l'intérieur d'une zone rectangulaire. Cette zone peut être manipulé via le tactile mais également le tangible. Concernant le tactile, son deplacement se fait avec 1 doigts, la rotation et le resize avec 2 doigts. Ces deux interactions ne sont pour l'instant pas paramétrable puisqu'elles ne s'adaptent pas encore à un nombre de doigts passé en options.

Concernant le tangible, la widget peut être deplacée, pivotée, agrandie/retrecie, et supprimée via des objets. Les IDs des objets pour réaliser ses interactions sont tous passé en paramètre du constructeur de la widget.

Dans le code source, une ElementWidget est une classe abstraite regroupant toute la logique métier décrite précedemment (rotation, resize, ...) et n'est donc pas associé à un type d'élement à afficher (image, vidéo, ...). Cette structure permet de bien séparer la logique en commun à chaque ElementWidget et celle propre au type affiché.

// PRESENTER LES FONCTIONS D'ACTIVATION/DESACTIVATION rotation,...

### ImageElementWidget

La première implémentation d'ElementWidget (ImageElementWidget) permet d'afficher tout type d'image compatible avec la balise '\<img>' d'HTML5. 
Constructeur : constructor(x, y, width, height, initialRotation, src, tagMove, tagDelete, tagZoom)
Quels formats d'images sont pris en compte...
Constructeur

Interactions possibles : rotation, resize, mouvement, suppression

### VideoElementWidget

Une deuxième implémentation d'ElementWidget (VideoElementWidget) concerne l'affichage de vidéo. Comme ImageElementWidget, les vidéos compatible avec cette widget sont les formats supportés par la balise '\<video>' d'HTML5.
Constructeur : constructor(x, y, width, height, initialRotation, src, tagMove, tagDelete, tagZoom, tagPlayPause, tagVolume)
Example d'utilisation + image
Interactions possibles : rotation, resize, mouvement, suppression, play/pause(uniquement tangible)
