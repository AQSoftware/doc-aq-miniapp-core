Timer example:
```html
<Timer
  duration={5}
  width={200}
  height={35}
  borderWidth={1}
  borderColor='black'
  borderRadius={20}
  textColor='white'
  backgroundColor='gray'
  onTimeout={() => { alert('Timer ended!');}}
/>
```
```example
<div>
  <a href="#" onClick={() => { this.timer.start(); }}>Start timer</a> |
  <a href="#" onClick={() => { this.timer.stop(); }}>Stop timer</a> |
  <a href="#" onClick={() => { this.timer.restart(); }}>Restart timer</a><p/>
  <Timer
    duration={5}
    width={200}
    height={35}
    borderWidth={1}
    borderColor='black'
    borderRadius={20}
    textColor='white'
    backgroundColor='gray'
    onTimeout={() => { alert('Timer ended!');}}
    ref={(item) => { this.timer = item; }}
  />
</div>
```
