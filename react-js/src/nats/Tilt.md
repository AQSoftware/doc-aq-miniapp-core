Timer example:
```html
<Tilt  
  onTilt={(degrees) => { console.log(`degrees = ${degrees}`); }}
/>
```
```example
initialState = { degrees: 0 };
<div>
  <div>Tilt your device to see the changes in orientation. Current orientation: {state.degrees} degrees.</div>
  <Tilt
    onTilt={(degrees) => { setState({degrees: degrees}); }}
  />
</div>
```
