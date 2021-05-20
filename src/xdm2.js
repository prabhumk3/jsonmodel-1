export let getDefaultDefinitions = () => {
    return {
        "definitionName": {
            "properties": []
        }
    };
}

export let finalJsonOutput = (jsonObject , params) => {
    console.log("================finalJsonOutput==================");

    const jsonData = {

        "meta:license": [
            "Copyright 2020 Adobe Systems Incorporated. All rights reserved.",
            "This work is licensed under a Creative Commons Attribution 4.0 International (CC BY 4.0) license",
            "you may not use this file except in compliance with the License. You may obtain a copy",
            "of the License at https://creativecommons.org/licenses/by/4.0/"
        ],
        "$id": `https://ns.adobe.com/xdm/${params.schemaType}/${params.schemaName}`,
        "$schema": "http://json-schema.org/draft-06/schema#",
        "title": params.title,
        "type": "object",
        "meta:extensible": true,
        
        // "meta:abstract": true,
        // "definitions": {
        //     [params.schemaName] : jsonObject.definitionName
        // }
    }

    let metaAbstract = false
    if (params.schemaType === "Class" || params.schemaType === "Mixin") {
        metaAbstract = true
    } else {
        metaAbstract = false
    }

    jsonData["meta:abstract"] = metaAbstract
    if (params.schemaType === "Class") {
        jsonData["meta:extends"] = [`https://ns.adobe.com/xdm/data/${params.behaviour}`]
        // "https://ns.genesis.com/xdm/common/auditable" ];
    }
    if (params.schemaType === "Mixin") {
        jsonData["meta:intendedToExtend"] = [`https://ns.adobe.com/xdm/classes/${params.behaviour}`]
        // "https://ns.genesis.com/xdm/common/auditable" ];
    }
    jsonData["description"] = params.description
    jsonData["definition"] = {
        [params.schemaName] : params.definition.definitionName
    }
    jsonData['allOf'] = [{ "$ref": `#/definitions/${params.schemaName}` }];
    jsonData["meta:status"] = params.metaStatus;
    return jsonData
}

export let addPropertyHandler = (jsonObject) => {
    console.log("json changed",jsonObject);
    const propertiesVal = getFirstValueFromMap(jsonObject)
    propertiesVal.properties.push({
        ':': {
            'title' : "",
            'type' : "",
            'description' :"",
            'examples' : ""
        }
    });
    return jsonObject;
};

export let getFirstValueFromMap = (jsonObject) => {
    const objKey = Object.keys(jsonObject)[0];
    console.log("obj",objKey);
    return jsonObject[objKey];
}

export let getFirstKeyFromMap = (jsonObject) => {
    return Object.keys(jsonObject)[0];
}

export let  plusHandler = (jsonObject,objectkey) => {
    let expectedProperty = jsonObject.definitionName;
    objectkey = objectkey + "";
    const keysArr = objectkey.split(".");       //0,0 =0.0
    for(let i = 0; i < keysArr.length; i++){
        expectedProperty = getFirstValueFromMap(expectedProperty.properties[keysArr[i]]);  //0 end val
    }
    expectedProperty.type = "object";
    if(!expectedProperty.properties){
        expectedProperty.properties = [];
    }
    expectedProperty.properties.push(
        {
            ':': {
                'title' : "",
                'type' : "",
                'description' :"",
                'examples':""
            }
        }
    );
    return jsonObject;
}

export let updateValue = (jsonObject , objectkey , changingProp, val) => {
    const propertiesVal = getFirstValueFromMap(jsonObject)
    let expectedProperty = propertiesVal;
    objectkey = objectkey + "";
    const keysArr = objectkey.split(".");
    expectedProperty = expectedProperty.properties[keysArr[0]];
    for(let i = 1; i < keysArr.length; i++){
        expectedProperty = getFirstValueFromMap(expectedProperty);
        expectedProperty = expectedProperty.properties[keysArr[i]];  //0 end val
    }
    let old_key = null;
    let old_keys = null;
    let new_key = null;

    const currentObject = getFirstValueFromMap(expectedProperty);

    switch(changingProp){
        case "title":
            currentObject.title = val;
            break;
        case "type":
            currentObject.type = val;
            break;
        case "description":
            currentObject.description = val;
            break;
            case "examples" :
                val = val.split(",");
            //    if (currentObject.type === "integer"){
                let intVal = [];
                for(let i = 0; i<val.length;i++){
                    if (val[i] !==""){
                        if(isNaN(val[i])){
                            intVal.push(val[i])
                        }else{
                            let currentval = parseInt(val[i])
                            intVal.push(currentval)
                        }
                       
                    }else{
                        intVal.push(val[i])
                    }
                   
                }
                
                currentObject.examples = intVal;
            //    }else{
                
            //     currentObject.examples = val;
            //    }
                break;
        case "keyT":
             old_key = getFirstKeyFromMap(expectedProperty);
             old_keys = old_key.split(":");
             new_key = `${val}:${old_keys[1]}`;
            Object.defineProperty(expectedProperty, new_key,
                Object.getOwnPropertyDescriptor(expectedProperty, old_key));
            delete expectedProperty[old_key];
            break;
        case "keyN":
            old_key = getFirstKeyFromMap(expectedProperty);
             old_keys = old_key.split(":");
             new_key = `${old_keys[0]}:${val}`;
            Object.defineProperty(expectedProperty, new_key,
                Object.getOwnPropertyDescriptor(expectedProperty, old_key));
            delete expectedProperty[old_key];
            break;
    }
    return jsonObject;
}

export let deleteProp = (jsonObject,objectkey) => {
    
    let expectedProperty = jsonObject.definitionName;
    var keyobj = objectkey.toString();
    if (keyobj.includes(".")){
        objectkey = objectkey + "";
    const keysArr = objectkey.split(".");
    expectedProperty = expectedProperty.properties[keysArr[0]];
    for(let i = 1; i < keysArr.length-1; i++){
        expectedProperty = getFirstValueFromMap(expectedProperty);
        expectedProperty = expectedProperty.properties[keysArr[i]]; 
        console.log(expectedProperty)

        //0 end val
    }
    let lastindex = objectkey[objectkey.length-1]
    console.log(lastindex);
    let val = getFirstValueFromMap( expectedProperty)
    console.log('vallllllllllll', val);
    val.properties.splice(lastindex)
    val.type = "string"
    }else{
        expectedProperty.properties.splice(objectkey,1)
        // expectedProperty.type = "string"
    }
    
    return jsonObject
}

