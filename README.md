# Lazy-load-images

## Usage

### Include jQuery and lazy load script on your page
```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="dist/script.js"></script>
```

### HTML
```html
<noscript data-lazyload-src="{{{srcThumb}}}" alt="{{{alt}}}">
	<img src="{{{srcThumb}}}" alt="{{{alt}}}">
</noscript>
```

### JavaScript
```javascript
$([data-lazyload-src]).lazyload();
```
