export let  initialObject = (params) => {
    
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
        "meta:abstract": true,
  
  }
  
  let metaAbstract = false 
  if (params.schemaType === "class" || params.schemaType === "mixin"){
      metaAbstract = true
    }else{
      metaAbstract = false
    }
  //   jsonData = dataObject(req , metaAbstract)
     
  //   console.log(req.body.schemaType);
    if (params.schemaType === "class"){
      jsonData["meta:extends"] = [ `https://ns.genesis.com/xdm/data/${params.behaviour}`] 
      // "https://ns.genesis.com/xdm/common/auditable" ];
    }
    if (params.schemaType === "mixin"){
      jsonData["meta:intendedToExtend"] = [ `https://ns.adobe.com/xdm/classes/${params.className}`] 
      // "https://ns.genesis.com/xdm/common/auditable" ];
    }
    let properties = params.addproperties
  // console.log(properties);
  console.log('mm==========================',Object.keys(jsonData));
  
    jsonData["description"] = params.description
    jsonData["definitions"] = {}
    jsonData.definitions[params.schemaName] = {}
    var s = jsonData.definitions[params.schemaName]
    s['properties'] = {}
    var addP = s['properties']
    for (const property in properties){
      console.log("vchjhjc",properties[property]);
      addP[`${properties[property].propertyNamespace}:${properties[property].propertyName}`] = {}
      var addList = addP[`${properties[property].propertyNamespace}:${properties[property].propertyName}`] 
      addList["title"] = properties[property].propertyTitle
      addList["type"] = properties[property].propertyType
     
      // if (properties[property].propertyType === 'object'){
      //     addList['properties'] = {}
      //     var addnestedProperty = addList['properties']
      //     var objectProp = params.addobjectProperties
      //     for(const property in objectProp){
      //         addnestedProperty[`${objectProp[property].propertyNamespace}:${objectProp[property].propertyName}`] = {}
      //         var addestedObjProp = addnestedProperty[`${objectProp[property].propertyNamespace}:${objectProp[property].propertyName}`]
      //         addestedObjProp["title"] = objectProp[property].propertyTitle
      //         addestedObjProp["type"] = objectProp[property].propertyType
      //         addestedObjProp['description'] = objectProp[property].propertyDescription
      //     }
         
      // }else{
      //     addList['description'] = properties[property].propertyDescription
      // }
  }
  
  // if (params.addDefination === []){
  //     console.log("no defination");
  // }else{
  //     var newdef = params.addDefination
  //    for(const def in newdef){
  //        jsonData.definitions[newdef[def].definationName] = {}
  //        var s = jsonData.definitions[newdef[def].definationName]
  //   s['properties'] = {}
  //   var addP = s['properties']
  //   var defProp = params.addDefProp
  //   for (const property in defProp){
  //     // console.log("vchjhjc",properties[property]);
  //     addP[`${defProp[property].propertyNamespace}:${defProp[property].propertyName}`] = {}
  //     var addList = addP[`${defProp[property].propertyNamespace}:${defProp[property].propertyName}`] 
  //     addList["title"] = defProp[property].propertyTitle
  //     addList["type"] = defProp[property].propertyType
     
  //     if (defProp[property].propertyType === 'object'){
  //         addList['properties'] = {}
  //         var addnestedProperty = addList['properties']
  //         var objectProp = params.addDefObjPropx
  //         for(const property in objectProp){
  //             addnestedProperty[`${objectProp[property].propertyNamespace}:${objectProp[property].propertyName}`] = {}
  //             var addestedObjProp = addnestedProperty[`${objectProp[property].propertyNamespace}:${objectProp[property].propertyName}`]
  //             addestedObjProp["title"] = objectProp[property].propertyTitle
  //             addestedObjProp["type"] = objectProp[property].propertyType
  //             addestedObjProp['description'] = objectProp[property].propertyDescription
  //         }
         
  //     }else{
  //         addList['description'] = properties[property].propertyDescription
  //     }
  // }
  //    }
  // }
      jsonData['allOf'] = [ 
    {
      "$ref": `#/definitions/${params.schemaName}`
    }]
  
    jsonData["meta:status"] = params.metaStatus
  
      return jsonData
      
  }