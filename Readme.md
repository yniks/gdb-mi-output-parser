# Super Light GDG/MI output parser

## usage:
#### Example raw output:
```javascript
const validgdbmioutputString=`bkpt={number="1",type="breakpoint",disp="keep",
     enabled="y",addr="0x000100d0",func="main",file="hello.c",
     fullname="/home/foo/hello.c",line="5",times="0"}
     (gdb)
`;
```
#### Parse
```javascript
const {parseGDBMIOutput}=require('./index');

var jsonoutput=parseGDBMIOutput(validgdbmioutputString);
```
