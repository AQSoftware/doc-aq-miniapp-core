Panel example:
```html
<Panel title="Panel" backgroundColor="rgba(38, 38, 38, 0.8)" width="200px" titleColor="White">
  <div>Some content</div>
</Panel>
```
```example
<Panel title="Panel" backgroundColor="rgba(38, 38, 38, 0.8)" width="200px" titleColor="White">
  <Button title="Button 1" isActive={true} onClick={() => { alert('Clicked 1!'); }}/>
  <Button title="Button 2" onClick={() => { alert('Clicked 2!'); }}/>
  <Button title="Button 3" onClick={() => { alert('Clicked 3!'); }}/>
</Panel>
```
