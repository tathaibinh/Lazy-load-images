# Lazy-load-images

## Usage

### Include jQuery and lazy load script on your page
```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="script.js"></script>
```

### HTML
```html
<noscript data-lazyload-src="{{{imgSrc}}}">
	<img src="{{{imgSrc}}}" alt="{{{alt}}}">
</noscript>
```

### JavaScript
```javascript
$(document).lazyload();
```

## TO DO

* Get rid of jQuery dependency
