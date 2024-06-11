```jsx !! lorem
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit;
  dolor = sit - amet(1 + dolor * 2);
  return dolor + 1;
  // lorem ipsum
}
```

```jsx !! ipsum
// !mark[/dolor/mg] #3d53ac66 10 15
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit;
  if (sit) {
    dolor = sit - amet(1 + dolor * 2);
    return dolor + 1;
  }
  return 10;
  // lorem ipsum
}
```

<!-- prettier-ignore -->
```jsx !! dolor
function lorem(ipsum, dolor = 1) {
  const sit =
    ipsum == null
      ? adipiscing(Math.random() * dolor)
      : ipsum.sit
  if (sit) {
    dolor = sit - amet(1 + dolor * 2)
    return dolor + 1
  }
  // !callout[/elit/] Lorem ipsum dolor sit amet
  let { elit, sed } = incididunt(ipsum)
  return elit + sed
}
```
