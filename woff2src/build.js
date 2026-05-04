/**
 * @file nodejs build
 * @author mengke01(kekee000@gmail.com)
 */
const fs = require('fs');

const REQUIRE_CALL_RE = /require\("([\w+/]+)"\)/g;
const UNSAFE_CREATE_NAMED_FUNCTION = 'function createNamedFunction(name,body){name=makeLegalFunctionName(name);return new Function("body","return function "+name+"() {\n"+\'    "use strict";\'+"    return body.apply(this, arguments);\n"+"};\n")(body)}';
const SAFE_CREATE_NAMED_FUNCTION = 'function createNamedFunction(name,body){name=makeLegalFunctionName(name);return function(){return body.apply(this,arguments)}}';
const UNSAFE_MAKE_DYN_CALLER = 'function makeDynCaller(dynCall){var args=[];for(var i=1;i<signature.length;++i){args.push("a"+i)}var name="dynCall_"+signature+"_"+rawFunction;var body="return function "+name+"("+args.join(", ")+") {\n";body+="    return dynCall(rawFunction"+(args.length?", ":"")+args.join(", ")+");\n";body+="};\n";return new Function("dynCall","rawFunction",body)(dynCall,rawFunction)}';
const SAFE_MAKE_DYN_CALLER = 'function makeDynCaller(dynCall){return function(){var callArgs=[rawFunction];for(var i=0;i<arguments.length;++i){callArgs.push(arguments[i])}return dynCall.apply(null,callArgs)}}';
const UNSAFE_CRAFT_INVOKER_TAIL = 'args1.push(invokerFnBody);var invokerFunction=new_(Function,args1).apply(null,args2);return invokerFunction';
const SAFE_CRAFT_INVOKER_TAIL = 'var invokerFunction=function(){if(arguments.length!==argCount-2){throwBindingError("function "+humanName+" called with "+arguments.length+" arguments, expected "+(argCount-2)+" args!")}var destructors=needsDestructorStack?[]:null;var wiredArgs=[];var thisWired;if(isClassMethodFunc){thisWired=argTypes[1].toWireType(destructors,this);wiredArgs.push(thisWired)}for(var i=0;i<argCount-2;++i){wiredArgs.push(argTypes[i+2].toWireType(destructors,arguments[i]))}var invokeArgs=[cppTargetFunc];for(var j=0;j<wiredArgs.length;++j){invokeArgs.push(wiredArgs[j])}var rv=cppInvokerFunc.apply(null,invokeArgs);if(needsDestructorStack){runDestructors(destructors)}else{if(isClassMethodFunc&&argTypes[1].destructorFunction!==null){argTypes[1].destructorFunction(thisWired)}for(var k=0;k<argCount-2;++k){var argType=argTypes[k+2];if(argType.destructorFunction!==null){argType.destructorFunction(wiredArgs[k+(isClassMethodFunc?1:0)])}}}if(returns){return argTypes[0].fromWireType(rv)}};return invokerFunction';

function replaceOrAssert(content, label, unsafeValue, safeValue) {
    if (content.includes(safeValue)) {
        return content;
    }

    if (!content.includes(unsafeValue)) {
        throw new Error(label + ' pattern not found in generated woff2.js');
    }

    return content.replace(unsafeValue, safeValue);
}

function rewriteContent(content) {
    let newContent = content.replace(REQUIRE_CALL_RE, ($0, $1) => {
        return 'require(["' + $1 + '"].join(""))';
    });

    newContent = replaceOrAssert(
        newContent,
        'createNamedFunction',
        UNSAFE_CREATE_NAMED_FUNCTION,
        SAFE_CREATE_NAMED_FUNCTION,
    );
    newContent = replaceOrAssert(
        newContent,
        'makeDynCaller',
        UNSAFE_MAKE_DYN_CALLER,
        SAFE_MAKE_DYN_CALLER,
    );
    newContent = replaceOrAssert(
        newContent,
        'craftInvokerFunction',
        UNSAFE_CRAFT_INVOKER_TAIL,
        SAFE_CRAFT_INVOKER_TAIL,
    );

    return newContent;
}

function rewriteFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const newContent = rewriteContent(content);

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
    }

    return newContent !== content;
}

if (require.main === module) {
    rewriteFile('./woff2.js');
    console.log('patched woff2.js for CommonJS and CSP');
}

module.exports = {
    rewriteContent,
    rewriteFile,
};