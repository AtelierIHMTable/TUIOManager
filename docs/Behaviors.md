# Behavior
L'objectif d'un behavior est d'ajouter du comportement à un élément graphique. Il est possible de les imbriquer afin d'avoir un comportement complet.
L'imbrication de widget ne doit pas avoir de sens et doit fonctionner, néanmoins, deux interactins ayant les memes conditions (à deux doigts par exemple) rentrerons facilement en conflit et auront probablement des comportements inattendus, pensez à utiliser du tangible et du tactile pour différencier des triggers qui entreraient en conflit.

Avec ce système de décorateur, il devrait être facile d'étendre la lsite des interactions implémentées et contribuer à ce projet.

Tous les Behavior sont suffixés par `Widget`, pour la lisibilité, le suffixe sera homis dans les titres 


## Interactions tactiles
Tous les Behaviors tactiles sont préffixés par `Touch`, pour la lisibilité, le préfixe sera homis dans les titres.

_Note : les interactions impliquant un suivi de l'objet tangible (déplacement, rotation, etc) ne réagissent bien que si l'objet tangible est déplacé doucement. Évitez de baser votre interaction sur de grand mouvements d'objets tangibles._ 
### Interact
Permet d'ajouter un comportement après un touché simple. Ne fonctionne pas si un deplacement de plus de 10px est fait après l'appui. 

_(Empêcher tout déplacement rend l'utilisation sur la table quasi impossible bien que foncitonnant avec le simulateur)_
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchInteractWidget(widget, (widget) => {
    // Il est possible ici d'utiliser la référence du widget
    // pour agir sur son dom
    // Le widget référencé est le widget décoré.
});
```

### GoOnTop
Permet au widget de passer aux dessus des autres widgets lorsqu'il est touché.

_Note : le widget passe au dessus des autres widget, mais pas forcément au dessus de tous les éléments du DOM._
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchGoOnTopWidget(widget);
```

### Move
Permet de déplacer un Widget avec un doigt
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchMoveWidget(widget);
```

### Rotate
Permet de tourner un Widget avec deux doigts
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchRotateWidget();
```

### CenterRotate
Permet de tourner un Widget avec un doigt par rapport au centre
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchCenterRotateWidget(widget);
```

### Zoom
Permet de zoomer un Widget avec deux doigts
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchZoomWidget(widget);
```

### Delete
Supprime le widget au toucher
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchDeleteWidget(widget);
```

### Drag
Permet de déplacer le widget, réagit lorsqu'il est drop dans une zone (voir DropWidget)

```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchDragWidget(widget, (zoneName, dropWidget) => {
        // Régir en fonction de la zone
        // Possibilité d'interagir sur le dropzoneWidget directement 
        //  (pour changer son visuel une fois le drag n drop effectué par exemple)
    }, 
    ['TEST'], // Permet de mettre en avant le DropWidget ayant pour nom de zone 'TEST' si celui-ci implémente les méthodes associés
);
```
### RotateInteract
Permet d'intéragir avec deux doigts et le comportement des rotations. Il est possible d'utiliser l'angle actuel ou le delta dans la fonction de callback

Delta won't be higher than 360

_Warning, on 360 gap you can have delta > 3XX_ 

```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TouchRotateInteractWidget(widget, (delta, angle) => {
    console.log(`angle : ${angle}; delta : ${delta}`);
  });
```
## Interactions tangibles
Tous les Behaviors tactiles sont préffixés par `Tag`, pour la lisibilité, le préfixe sera homis dans les titres.

### Interact
Permet d'ajouter un comportement après avoir posé un tag sur l'élément. Ne fonctionne pas en déplacant l'objet sur le widget.
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TagInteractWidget(widget, (widget) => {
    // Il est possible ici d'utiliser la référence du widget
    // pour agir sur son dom
    // Le widget référencé est le widget décoré.
}, '9') // Réagit au tag 9;
```

### Move
Permet de déplacer un Widget avec un élément tangible
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TagMoveWidget(widget, '9') // Réagit au tag 9;
```

### CenterZoom
Permet de tourner un Widget avec avec un élément tangible par rapport au centre
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TagCenterZoomWidget(widget, '9') // Réagit au tag 9;
```

### CenterRotate
Permet de tourner un Widget avec avec un élément tangible par rapport au centre
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TagCenterRotateWidget(widget, '9') // Réagit au tag 9;
```

### Delete
Supprime le widget au toucher
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new TagDeleteWidget(widget, '9') // Réagit au tag 9;
```

## Utils

### Drop
Défini un widget comme une zone interactive pour les TouchDragWidget et permet de définir comment mettre en valeur la zone lorsque l'interaction peut être déclenchée.

```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new DropWidget(widget,
    'TEST', // Nom de la zone 
    (widget) => {
        // Ajoute une bordure rouge lorsqu'un TouchDragWidget peut interagir avec cette zone
        widget.domElem.css('border', 'solid 1px red') 
    },
    (widget) => {
        // Supprime la bordure rouge lorsque le TouchDragWidget ne peut plus interagir avec cette zone
        widget.domElem.css('border', 'none')
    },
); // Pour activer la bordure rouge, le TouchDragWidget doit avoir 'TEST' dans sa liste zoneForInteractions
```

### InitialRotationWidget
Ajoute une rotation initiale à un élément. Prend en compte la position x, y AVANT rotation.
```typescript
const widget = new PlaceholderWidget(50, 50, 500, 500, 'blue');
const withBehavior = new InitialRotationWidget(widget, 90) // Tourne le widget à 90°
```
