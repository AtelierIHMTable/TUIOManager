# TUIOManager

This fork includes some breaking changes to the [original TUIOManager](https://github.com/AtelierIHMTable/TUIOManager). TUIO events are
now dispatched directly into the DOM, making the use of widgets obsolete whilst also simplifying the API.

## Installation
### NPM
```bash
npm install @dj256/tuiomanager
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@dj256/tuiomanager"></script>
```

## Initialization
In order to have TUIO events dispatched into the DOM, you need to initialize the TUIOManager:
### NPM
```javascript
import { TUIOManager } from '@dj256/tuiomanager';
TUIOManager.start();
```

### CDN
```javascript
<script>
  TUIOManager.start();
</script>
```

## Configuration
You can configure the TUIOManager by passing an object to the `start` method:
```javascript
TUIOManager.start({ ...options });
```
The following options are available:
- `anchor`: `HTMLElement` - The element that will be used as the origin for the TUIO coordinates. This is very important
    as TUIO events are dispatched by matching the coordinates of the event with the elements on the page. If your
    surface covers the whole page, you can leave this field empty. TUIOManager will the use the window's dimensions as
    a reference.
- `showInteractions`: `boolean` - Whether to show the interactions on the page. Defaults to `false`.
- `showTagIds`: `boolean` - Whether to show the tag IDs on the page. Defaults to `false`.
- `socketIOUrl`: `string` - The URL of the socket.io server. Defaults to `http://localhost:9000`.

## Usage
Once the TUIOManager is initialized, you can listen to TUIO events on any DOM element:
```javascript
const element = document.getElementById('myElement');
element.addEventListener('tuiotouchdown', (event) => {
  console.log(event.detail);
});
```
TUIOManager uses custom events, so you will need to access the event details through `event.detail`.

## Events
All events are dispatched both on the elements that are at the event coordinates (uses `document.elementsFromPoint`) and
on the `document` object. It is recommended to listen to `tuiotouchmove`, `tuiotouchup`, `tuiotagmove` and `tuiotagup`
events directly from the `document` object. Thus, if you are implementing a dragging system, you will still receive the
events even if the touch event or tag moves outside boundaries of the element being dragged.
<br><br>

### `tuiotouchdown`
#### Description
Dispatched when a new touch is detected.
#### Event details
- `x`: The x coordinate of the touch event
- `y`: The y coordinate of the touch event
- `id`: The touch event ID
<br><br>

### `tuiotouchmove`
#### Description
Dispatched when the position of a touch changes.
#### Event details
- `x`: The x coordinate of the touch event
- `y`: The y coordinate of the touch event
- `id`: The touch event ID
<br><br>

### `tuiotouchup`
#### Description
Dispatched when a touch is deleted.
#### Event details
- `x`: The x coordinate of the touch event
- `y`: The y coordinate of the touch event
- `id`: The touch event ID
<br><br>

### `tuiotagdown`
#### Description
Dispatched when a tag is placed on the surface.
#### Event details
- `x`: The x coordinate of the tag event
- `y`: The y coordinate of the tag event
- `angle`: The angle of the tag
- `id`: The ID of the tag
<br><br>

### `tuiotagmove`
#### Description
Dispatched when the position of a tag changes. This event is also dispatched when the angle of the tag changes.
#### Event details
- `x`: The x coordinate of the tag event
- `y`: The y coordinate of the tag event
- `angle`: The angle of the tag
- `id`: The ID of the tag
<br><br>

### `tuiotagup`
#### Description
Dispatched when a tag is removed from the surface.
#### Event details
- `x`: The x coordinate of the tag event
- `y`: The y coordinate of the tag event
- `angle`: The angle of the tag
- `id`: The ID of the tag
<br><br>

## Multi-touch and multi-tag considerations
When designing applications that allow multiple simultaneous touches or tags, you can make use of the `id` field of the
events to keep track of the different touches or tags. Each new touch has a unique ID, and a tag will always have the
same ID. This means that you can use the same event listener for all touches or tags, and use the `id` field to
distinguish between them.

## Examples
You can find some examples in the `examples` folder. To test them, you can simply open the `index.html` file in your
browser. If you want to play around with the examples' code and see live edits, you can use [lite-server](https://www.npmjs.com/package/lite-server)
like so:
```bash
# Install lite-server if you haven't already
npm install -g lite-server
cd examples/simple-drag
lite-server
```
