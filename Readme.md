# Super Light GDG/MI output parser

## Usage:
#### Example raw MI output:
```javascript
const validgdbmioutputString=`231^done,bkpt={number="1",type="breakpoint",disp="keep",
     enabled="y",addr="0x000100d0",func="main",file="hello.c",
     fullname="/home/foo/hello.c",line="5",times="0"}
     (gdb)
231^done,bkpt={number="1",type="breakpoint",disp="keep",
     enabled="y",addr="0x000100d0",func="main",file="hello.c",
     fullname="/home/foo/hello.c",line="5",times="0"}
     (gdb)

231^done,bkpt={number="1",type="breakpoint",disp="keep",
     enabled="y",addr="0x000100d0",func="main",file="hello.c",
     fullname="/home/foo/hello.c",line="5",times="0"}
     (gdb)
`;
```
#### do Parse:
```javascript
const {parseGDBMIOutput}=require('./index');

var jsonoutput=parseGDBMIOutput(validgdbmioutputString);
```
#### Parse Result:
```json
[{"bkpt":{"number":"1","type":"breakpoint","disp":"keep","enabled":"y","addr":"0x000100d0","func":"main","file":"hello.c","fullname":"/home/foo/hello.c","line":"5","times":"0"},"token":"34","async-type":"result-record","class":"data"},{"bkpt":{"number":"1","type":"breakpoint","disp":"keep","enabled":"y","addr":"0x000100d0","func":"main","file":"hello.c","fullname":"/home/foo/hello.c","line":"5","times":"0"},"token":"34","async-type":"result-record","class":"data"},{"bkpt":{"number":"1","type":"breakpoint","disp":"keep","enabled":"y","addr":"0x000100d0","func":"main","file":"hello.c","fullname":"/home/foo/hello.c","line":"5","times":"0"},"token":"34","async-type":"result-record","class":"data"}]
```

### :warning: Caution:
     This library depends to an ES6 feature,if that feature is found to be missing,it will try to patch by itself.(string.prototype.replaceall)
### References:
- [Output Syntax](https://www.zeuthen.desy.de/dv/documentation/unixguide/infohtml/gdb/GDB_002fMI-Output-Syntax.html#GDB_002fMI-Output-Syntax)
- [Example Output](https://www.zeuthen.desy.de/dv/documentation/unixguide/infohtml/gdb/GDB_002fMI-Breakpoint-Commands.html#GDB_002fMI-Breakpoint-Commands)
