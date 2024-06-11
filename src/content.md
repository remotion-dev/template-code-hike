```ts !! dolor
let msg = `Hello, world`;
//    ^?

msg = "Hi there";

console.log(msg);
```

```ts !! dolor
const msg = `Hello, world`;
//    ^?

// @errors: 2588
msg = "Hi there";

console.log(msg);
```
