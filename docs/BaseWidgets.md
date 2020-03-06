# BaseWidget
Classe abstraite pour le widget graphique de base.
Son constructeur prend en paramètres les valeurs de positions et taille. Cependant, il n'effectue aucune action sur l'élément du DOM qui compose le widget. C'est la responsabilité des classes enfants d'appliquer les règles CSS.

Exemple dans une classe fille (PlaceholderWidget)
```typescript
this._domElem = $('<div></div>')
  .css('position', 'absolute')
  .css('left', `${x}px`)
  .css('top', `${y}px`)
  .width(this.width)
  .height(this.height)
  .css('background', color);
```

## Z index
Chaque widget a un z-index qui lui est défini. Celui-ci est défini lors de l'ajout au DOM et non à la création du widget.

## Fonctions
| Fonction      | Effet           |
| ------------- |:-------------|
| addTo(DOMElement) | Ajoute le widget à l'élément du DOM  |
| isTouched(x, y) | Est-ce qu'un point au coordonnées (x, y) touche l'élément (prend en compte le z-index) |

## Getters et setters
| Attribut      | Effet           |
|-------------|:-------------|
| currentTransform | permet d'ajouter des transformations au widget sans perdre les précédentes |
| x | position x initial de l'élément |
| y | position y initial de l'élément |
| width | largeur initiale de l'élément |
| heigth | hauteur initiale de l'élément |

Pour obtenir la position ou la taille d'un widget, utilisez les fonctions JQuery, exemple :
```typescript
this.domElem.width();        //width
this.domElem.height();       //height
this.domElem.offset().top;   //y
this.domElem.offset().left  //x
```

# ImageWidget

Permet d'afficher une image depuis sa source. L'attribut object-fit du constructeur permet de définir le comportement de l'image lorsque width/height n'a pas le ratio de l'image.
Note : la fonction isTouched de ImageWidget prendra en compte la taille définie et non l'espace occupé par l'image.

# WrapperWidget
Englobe des widgets dans un widget supérieur. Il permet d'ajouter du comportement sur un ensemble de widget.
Lors de la définition des widgets enfant, il faut définir leur position selon l'écran. Le WrapperWidget qui englobe les widgets fait en sorte de les englober avec le carré ayant la surface minimale

Exemple 
```typescript
const root = $('body');
const widgets = [
  new PlaceholderWidget(50, 50, 50, 50, 'blue'),
  new PlaceholderWidget(110, 50, 50, 50, 'blue'),
  new PlaceholderWidget(50, 110, 50, 50, 'blue'),
  new PlaceholderWidget(110, 110, 50, 50, 'blue'),
];
new WrapperWidget(...widgets).addTo(root)
```
Cet exemple produit un wrapper ayant une largeur et hauteur de 160 en position (50,50)

_Pour des questions de performances, WrapperWidget ne se met pas à jour lors d'un événement. Si ce comportement est essentiel, il faut recalculer sa hitbox (de la même manière qu'elle est calculée lors de la construction). Vous pouvez définir un nouveau type de Wrapper pour cela._

# TextWidget

Permet d'afficher du texte. Le max-width et autre attributs servent à avoir un texte sur plusieurs ligne. La hauteur n'est pas correcte dans le code, ne pas utiliser le getter de height.

# PlaceholderWidget
Utile pour tester durant le développement
