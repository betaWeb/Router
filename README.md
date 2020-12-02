# Router
A Simple JavaScript history-based router class

## Getting started
Just add the `router.min.js` script on your page.
```html
<script src="path/to/router.min.js"></script>
```

After, you just have to instanciate a new Router, and declare routes as follow :
```javascript
const router = new Router({ mode: 'hash' })

router.add('/', function () {
    console.log('This is the Homepage')
}, 'homepage')
```

You also can add parameters to a route :
```javascript
router.add('/posts/:id/show', function (id) {
    console.log(`This is the post #${id}`)
}, 'posts.show')
```

You can define grouped routes, with a prefix :
```javascript
router.group('posts', function () {
    router.add('/', function () {
       console.log('All the posts')
   }, 'posts.index')

    router.add('/create', function () {
       console.log('Create a post')
   }, 'posts.create')
})
```

You can, or course, navigate between all your routes :
```javascript
router.navigate({ name: 'homepage' }) // Navigate to route named 'homepage'
router.navigate('posts/create') // Navigate to route named 'posts/create'
```
