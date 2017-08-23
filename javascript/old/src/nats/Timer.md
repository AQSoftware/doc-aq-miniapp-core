Timer example:
```html
<Timer
  duration={5}
  delay={1000}
  onRender={(count) => {
    return <div>count</div>
  }}
  onTimeout={() => { alert('Timer ended!');}}
/>
```
```example
<div>
  <a href="#" onClick={() => { this.timer.start(); }}>Start timer</a> |
  <a href="#" onClick={() => { this.timer.stop(); }}>Stop timer</a> |
  <a href="#" onClick={() => { this.timer.reset(); }}>Reset timer</a> |
  <a href="#" onClick={() => { this.timer.restart(); }}>Restart timer</a><p/>
  <Timer
    duration={5}
    delay={1000}
    onRender={(count) => {
      return <div>{Math.round(count / 1000)} seconds</div>
    }}
    onTimeout={() => { alert('Timer ended!');}}
    ref={(item) => { this.timer = item; }}
  />
</div>
```
