//+status-async-output: contains on-going status information about the progress of a slow operation. It can be discarded.
//*exec-async-output : message about exection oprtation
//=notify-async-output : contains supplementary information
//~console-stream-output :is output that should be displayed as is in the console.
//@target-stream-output is the output produced by the target program.
//&log-stream-output: contains on-going status information about the progress of a slow operation. It can be discarded.
//^result-record

//fix eS6
var {Transform}=require('stream')
if (!String.prototype.replaceAll)
{
    var es6fix=require('string.prototype.replaceall')
    String.prototype.replaceAll=function(...arg)
    {
        return es6fix(this,...arg)
    }
}
const RE_GDBMI_OUTPUT=()=>/^(\d*)?(.)\b([a-zA-Z\-]*?)(,([\s\S]*?))??$/g
const RE_GDBMI_OUTPUT_CONSOLE=()=>/^(\d*)?(~|&|@)(.*?)$/g
const RE_GDBMI_KEYS=()=>/([^"]|^)\b([\w\-]*)\b(=)/g
const outputtypeSymbolMap={
    '^':"result-record",
    '+':"status-async-output",
    '*':"exec-async-output",
    '=':"notify-async-output",
    '~':"console-stream-output",
    '@':"target-stream-output",
    '&':"log-stream-output"
}
function parserecord(listText)
{
    var str=(`{${listText.replaceAll(RE_GDBMI_KEYS(),(_,pre,word,eq)=> pre.trim()+'"'+word+'":')}}`)
    return  JSON.parse(str)
}
var partbuffer=''
function parseGDBMIOutputLine(line)
{
    if(line===undefined){ partbuffer='';return}
    try{
        var [_,token,asyncOutputSymbol,resultClass,_,recordList='']=RE_GDBMI_OUTPUT().exec(line)
        return Object.assign(parserecord(recordList),{token,'async-type':outputtypeSymbolMap[asyncOutputSymbol],"class":resultClass})
    }
    catch(e)
    {
        try
        {
            var [_,token,asyncOutputSymbol,text]=RE_GDBMI_OUTPUT_CONSOLE().exec(line)
            return {
                token,
                'stream-type':outputtypeSymbolMap[asyncOutputSymbol],
               text
            }
        }
        catch(e)
        {
            if(line.match(/^\(gdb\)/))
            {
                return {
                    sequenceEnded:true,
                    text:line
                }
            }
            else if(!!partbuffer)
            {
                var newline=partbuffer+line;
                partbuffer=''
                var result=parseGDBMIOutputLine(newline)//new Error("Illegal GDGMI output string!\nString must match 'RE_GDBMI_OUTPUT'")
                if(result){
                    return result
                }
                else partbuffer=newline
            }
            else partbuffer+=line;
        }
    }
}
class ParserTransformer extends Transform {
    constructor() {
      super({
        readableObjectMode: true,
        writableObjectMode: true
      })
    }
  
    _transform(chunk, encoding, next) {
      /**
       *  Support streaming feature of GDBMI parser
       */
        var output=parseGDBMIOutputLine(chunk)
        if(output!==undefined) this.push(output)
        return next(null)        
    }
  }

module.exports={parseGDBMIOutputLine,parseLine:parseGDBMIOutputLine,parserecord,ParserTransformer}