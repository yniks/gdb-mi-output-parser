//+status-async-output: contains on-going status information about the progress of a slow operation. It can be discarded.
//*exec-async-output : message about exection oprtation
//=notify-async-output : contains supplementary information
//~console-stream-output :is output that should be displayed as is in the console.
//@target-stream-output is the output produced by the target program.
//&log-stream-output: contains on-going status information about the progress of a slow operation. It can be discarded.
const RE_GDBMI_OUTPUT=()=>/(\d*)?(.)\b([a-zA-Z]*?),([\s\S]*?)\(gdb\)\n/g
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
    return JSON.parse(`{${listText.replaceAll(RE_GDBMI_KEYS(),(_,pre,word,eq)=> pre.trim()+'"'+word+'":')}}`)
}
function parseGDBMIOutput(text)
{
    try{
        var results=text.matchAll(RE_GDBMI_OUTPUT())
        var outputRecordDict=[...results].map(([_,token,asyncOutputSymbol,resultClass,recordList])=>
        Object.assign(parserecord(recordList),{token,'async-type':outputtypeSymbolMap[asyncOutputSymbol],"class":resultClass}))
         return outputRecordDict
    }
    catch(e)
    {
        throw "Illegal GDGMI output string!\nString must match 'RE_GDBMI_OUTPUT'"
    }
}
module.exports={parseGDBMIOutput,parserecord}