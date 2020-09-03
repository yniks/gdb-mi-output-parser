//+status-async-output: contains on-going status information about the progress of a slow operation. It can be discarded.
//*exec-async-output : message about exection oprtation
//=notify-async-output : contains supplementary information
//~console-stream-output :is output that should be displayed as is in the console.
//@target-stream-output is the output produced by the target program.
//&log-stream-output: contains on-going status information about the progress of a slow operation. It can be discarded.
//^result-record

//fix
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

function parseGDBMIOutputLine(line)
{
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
            if (line.match(/^\(gdb\)/))
            {
                return {
                    sequenceEnded:true,
                    text:line
                }
            }
            return new Error("Illegal GDGMI output string!\nString must match 'RE_GDBMI_OUTPUT'")
        }
    }
}
module.exports={parseGDBMIOutputLine,parseLine:parseGDBMIOutputLine,parserecord}