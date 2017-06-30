Timer example:
```html
<Timer
  timer={100}
  style={{
    width: 200,
    height: 35,
    borderRadius: 20,
    textColor: 'black',
    backgroundColor: 'blue'
  }}
/>
```
```example
<div>
  <a href="#" onClick={() => { this.timer.start(); }}>Start timer</a><p/>
  <Timer
    timer={100}
    style={{
      width: 200,
      height: 35,
      borderRadius: 20,
      textColor: 'black',
      backgroundColor: 'blue'
    }}
    ref={(item) => { this.timer = item; }}
  />
</div>
```
