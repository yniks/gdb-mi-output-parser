# Super Light GNU Debugger Machine Interface Interpreter output parser

## usage:
```javascript
const {parseGDBMIOutput}=require('./index');
const validgdbmioutputString=`bkpt={number="1",type="breakpoint",disp="keep",
     enabled="y",addr="0x000100d0",func="main",file="hello.c",
     fullname="/home/foo/hello.c",line="5",times="0"}
     (gdb)
`;
var jsonoutput=parseGDBMIOutput(validgdbmioutputString);
```
