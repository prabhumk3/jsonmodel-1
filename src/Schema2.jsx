import { Splitter, SplitterPanel } from 'primereact/splitter'
import LeftPanel from './LeftPanel'
import RightPanel from './rightPanel'
import './Schema2.css'
import React, { useState,useEffect } from "react";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'bootstrap/dist/css/bootstrap.css';
import { addPropertyHandler, plusHandler, updateValue, deleteProp } from "./xdm2";
import { ActionButton } from '@react-spectrum/button';


const baseObject = {
    "meta:license": [
        "Copyright 2020 Adobe Systems Incorporated. All rights reserved.",
        "This work is licensed under a Creative Commons Attribution 4.0 International (CC BY 4.0) license",
        "you may not use this file except in compliance with the License. You may obtain a copy of the License at https://creativecommons.org/licenses/by/4.0/"
    ],
    "$id": "https://ns.adobe.com/xdm/",
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "",
    "type": "object",

    "meta:extensible": true, // ALL ARE TRUE EXCEPT WHEN USER SELECTS SCHEMA
    "meta:abstract": true, // ALL ARE TRUE EXCEPT SELECTS SCHEMA
    "meta:extends": [
        "https://ns.adobe.com/xdm/data/"
      ],
    "description" : "",
   
    "definitions": {"definitionName": { //defination name
        "properties": []
    }},
    "allOf": [],
    "meta:Status": "experimental"
}


// MAIN COMPONENT
const Schema2 = () => {

    const schemaTypes = [
        {type: 'class', label: 'Add Class', style: {background: '#9498DC'}},
        {type: 'mixin', label: 'Add Mixin', style: {background: '#B582A3'}},
        // {type: 'dataType', label: 'Add DT', style: {background: '#D66D6C'}}
    ];
     
    const [schemaName, setschemaName] = useState('');
    
    const [behaviour, setbehaviour] = useState('');

    const [currentIndex , setCurrentIndex] = useState(0);
    const [schemaObjects, setSchemaObjects] = useState([]) //schemaObjects[currentIndex]



    //for adding the properties
    const handleInputChange = (e, changingProp, objKey) => {  //e = input value , objKey : index of property
        console.log("AASSSSS",e);
        //const activeSchemaCopy = JSON.parse(JSON.stringify(activeSchema));
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        var keyobj = objKey.toString(); //
        var definationCopy = {}
        if (keyobj.includes(".")){
            const keysArr = objKey.split(".");
            definationCopy = schemaObjectsCopy[keysArr[0]].jsonData.class.definitions 
        }else{
            definationCopy =   schemaObjectsCopy[currentIndex].jsonData.class.definitions
        }
        // var definationCopy =   schemaObjectsCopy[objKey].jsonData.class.definitions 
        const newDefinitions = updateValue(definationCopy, objKey, changingProp, e); //calling functionto update
        // setDefinitions({ "CLAZZ": newDefinitions.CLAZZ });
         definationCopy = newDefinitions
        if (keyobj.includes(".")){
            const keysArr = objKey.split("."); 
            //activeSchemaCopy.jsonData.class.definitions = definationCopy
            //console.log(activeSchemaCopy.jsonData.adddefination);
            schemaObjectsCopy[keysArr[0]].jsonData.class.definitions = definationCopy
        }else{
            //activeSchemaCopy.jsonData.class.definitions = definationCopy
            //console.log(activeSchemaCopy.jsonData.definition);
            schemaObjectsCopy[currentIndex].jsonData.class.definitions = definationCopy
        }
      
        //setActiveSchema(activeSchemaCopy);
        setSchemaObjects(schemaObjectsCopy);
        // setDefinitions(getDefaultDefinitions())
    };

    //for adding plus property || nested structure
    const handlePlusChange = (e, objKey,index) => {
        console.log(e.target.name);
        // setActiveSchema(schemaObjects[currentIndex])
        //console.log(activeSchema);
        //const activeSchemaCopy = JSON.parse(JSON.stringify(activeSchema));
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        var keyobj = objKey.toString(); 
        var definationCopy = {}
        if (keyobj.includes(".")){
            const keysArr = objKey.split(".");
            definationCopy = schemaObjectsCopy[index].jsonData.class.definitions 
        }else{
            definationCopy =   schemaObjectsCopy[index].jsonData.class.definitions
        }
          
        const newDefinitions = plusHandler(definationCopy, objKey);
        // setDefinitions({"CLAZZ": newDefinitions.CLAZZ} )
        definationCopy = newDefinitions
       if (keyobj.includes(".")){
           const keysArr = objKey.split("."); 
        //    activeSchemaCopy.jsonData.class.definitions = definationCopy
        //    console.log(activeSchemaCopy.jsonData.adddefination);
           schemaObjectsCopy[index].jsonData.class.definitions = definationCopy
        //    setActiveSchema(activeSchemaCopy);
           setSchemaObjects(schemaObjectsCopy);
       }else{
        //    activeSchemaCopy.jsonData.class.definitions = definationCopy
        //    console.log(activeSchemaCopy.jsonData.definition);
           schemaObjectsCopy[index].jsonData.class.definitions = definationCopy
        //    setActiveSchema(activeSchemaCopy);
           setSchemaObjects(schemaObjectsCopy);
       }
        
    };

    //closures
    const updateHandlerFactory = (changingProp, objKey) => {
        return (e) => {
            handleInputChange(e, changingProp, objKey);
        }
    }

    const plusHandlerFactory = (objKey,index) => {
        return (e) => {

            setCurrentIndex(index)
            console.log("currentindex", index);
            handlePlusChange(e, objKey,index);
           
        }
    }
    
    const addDynamicPropertyRow = (index) => {
        const activeSchemaCopy1 = JSON.parse(JSON.stringify(schemaObjects[index]));
        console.log("clicked add properties");
        const newDefinitions = addPropertyHandler(activeSchemaCopy1.jsonData.class.definitions);
        // setDefinitions([...definitions,{ "CLAZZ": newDefinitions.CLAZZ }]);
        setCurrentIndex(index)
        // setDefinitions({"CLAZZ": newDefinitions.CLAZZ} )
        // const activeSchemaCopy = JSON.parse(JSON.stringify(activeSchema));
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        // activeSchemaCopy.jsonData.class.definitions = newDefinitions
        schemaObjectsCopy[index].jsonData.class.definitions = newDefinitions
        // setActiveSchema(activeSchemaCopy);
        setSchemaObjects(schemaObjectsCopy);
        // setDefinitions(getDefaultDefinitions())
    }

    const deleteProperty = (i,currentindex) => {
       
        // setDefinitions([...definitions,{ "CLAZZ": result.CLAZZ }]);
        // setDefinitions({"CLAZZ": result.CLAZZ} )
        // const activeSchemaCopy = JSON.parse(JSON.stringify(activeSchema));
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        const deleteDefination = schemaObjects[currentIndex].jsonData.class.definitions
        // console.log(activeSchemaCopy);
        const result = deleteProp(deleteDefination, i);
        // activeSchemaCopy.jsonData.class.definitions = result
        schemaObjectsCopy[currentindex].jsonData.class.definitions = result
        // setActiveSchema(activeSchemaCopy);
        setSchemaObjects(schemaObjectsCopy);
        // setDefinitions(getDefaultDefinitions())
    }
    


    // dummy state
   
    // const [activeSchema, setActiveSchema1] = useState(undefined)

    /* const setActiveSchema = (obj) => {
        console.log("setActive Schemma called");
        console.log(obj);
        console.log("setActive Schemma done");
        setActiveSchema1(obj);
    }
    */

    const onDeleteSchema = (i) => {

        // Create a copy of the schemaObjects, delete at index on the copy, set copy as new schemaObjects
        let schemObjectsCP = JSON.parse(JSON.stringify(schemaObjects));
        // setActiveSchema(undefined);
        setSchemaObjects(schemObjectsCP.filter((item, index) => index !== i));

     }

     const onClassChange = (e,index) => {
        // console.log(e.value.name);
        // setClassName(e.value);
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        schemaObjectsCopy[currentIndex].jsonData.class["meta:extends"] = `https://ns.adobe.com/xdm/data/${e}`
        setbehaviour(e)
        schemaObjectsCopy[currentIndex].jsonData.behaviour = e
        setSchemaObjects(schemaObjectsCopy);
    }

    const onmixinChange = (e,index) => {
        // setMixinBehaviour(e.value);
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        schemaObjectsCopy[currentIndex].jsonData.class["meta:extends"] = `https://ns.adobe.com/xdm/classes/${e}`
        setbehaviour(e)
        schemaObjectsCopy[currentIndex].jsonData.behaviour = e
        setSchemaObjects(schemaObjectsCopy);
    }

    const onMetaStatusChange = (e) => {
        // setMixinBehaviour(e.value);
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        schemaObjectsCopy[currentIndex].jsonData.class["meta:Status"] = e
        
        setSchemaObjects(schemaObjectsCopy);
    }

//handling input for name, title
    const onSchemaChangeHandler = (e,index,name) => {
        console.log("name",e);
        // const activeSchemaCopy = JSON.parse(JSON.stringify(activeSchema));
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        // console.log(activeSchemaCopy.jsonData);
        setCurrentIndex(index)
        switch (name) {
            case "schemaName":
                setschemaName(e);
                // activeSchemaCopy.jsonData.class.$id = `https://ns.adobe.com/xdm/Class/${e}`
                let type = ''
                if (schemaObjectsCopy[index].type === 'class'){
                    type = 'classes'
                }else{
                    type = 'mixins'
                }
                schemaObjectsCopy[index].jsonData.class.$id = `https://ns.adobe.com/xdm/${type}/${e}`;
                schemaObjectsCopy[currentIndex].jsonData.class["meta:extends"] = `https://ns.adobe.com/xdm/data/${behaviour}`
                // activeSchemaCopy.jsonData.class.allOf = [{'$ref':`#/definitions/${e}`}];
                schemaObjectsCopy[index].jsonData.class.allOf =[{'$ref':`#/definitions/${e}`}];
                // let jsonString = JSON.stringify(schemaObjectsCopy[index].jsonData.class)
                // const propertiesVal = getFirstKeyFromMap(schemaObjectsCopy[index].jsonData.class.definitions)
                // console.log(JSON.stringify(schemaObjectsCopy[index].jsonData.class));
                // jsonString = jsonString.replace(propertiesVal,e)
                // let copy =  JSON.parse(jsonString)
                // schemaObjectsCopy[index].jsonData.class = copy
                schemaObjectsCopy[index].jsonData.schemaName = e
                
                break;
                case "schemaTitle":
                    // setschemaTitle(e);
                    // activeSchemaCopy.jsonData.class.title = e
                    schemaObjectsCopy[index].jsonData.class.title = e;
                    break;
            case "schemaDescription":
                // setDescription(e);
                // activeSchemaCopy.jsonData.class.description = e
                schemaObjectsCopy[index].jsonData.class.description = e;
                break;
                
        }
        // console.log('COPY', activeSchemaCopy);
        // console.log('activeSchema', activeSchema)
        
        // setActiveSchema(activeSchemaCopy);
        setSchemaObjects(schemaObjectsCopy);
    }

    const getobjectfromJson = (e) => {
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        schemaObjectsCopy[currentIndex].jsonData.class = e;
        setSchemaObjects(schemaObjectsCopy);
    }

    const onWindowAction = (isMinimized, index) => {
        console.log('HERE', isMinimized, index)
        // Make copies
        // const activeSchemaCopy = JSON.parse(JSON.stringify(activeSchema));
        const schemaObjectsCopy = JSON.parse(JSON.stringify(schemaObjects));
        // change values
        // activeSchemaCopy.minimized = isMinimized;
        schemaObjectsCopy[index].minimized = isMinimized;

        // setActiveSchema(activeSchemaCopy);
        setSchemaObjects(schemaObjectsCopy);
    }

    const onAddSchema = async (type) => {
        let schemaObjectsCP = JSON.parse(JSON.stringify(schemaObjects));
        if (schemaObjectsCP.length !== 0){
            const latestIndex = schemaObjectsCP.length + 1
            setCurrentIndex(latestIndex-1)
        }else{
            setCurrentIndex(0)
        }
        console.log(currentIndex );
        switch (type) {
            case 'class':
                const classSchema = {type: 'class', minimized: false, jsonData: {class:baseObject , schemaName : schemaName,behaviour :behaviour} 
                };
                // setActiveSchema(classSchema)
                schemaObjectsCP.push(classSchema);
                // setschemaType("Class")
                setSchemaObjects(schemaObjectsCP);
                break;
            case 'mixin':
                const mixinSchema = {type: 'mixin', minimized: false,  jsonData: {class:baseObject , schemaName : schemaName,behaviour :behaviour} 
                };
                // setActiveSchema(mixinSchema)
                schemaObjectsCP.push(mixinSchema);
                setSchemaObjects(schemaObjectsCP);
                console.log(schemaObjects);
                break;
            // case 'dataType':
            //     const dataTypeSchema = {type: 'dataType', minimized: false,  jsonData: {class:baseObject } 
            // };
            //     setActiveSchema(dataTypeSchema)
            //     schemaObjectsCP.push(dataTypeSchema);
            //     setSchemaObjects(schemaObjectsCP);
            //     break;
            default:
                break;
        }
    }
    

    return (<>
        {/* Navigation Bar */}
        <div style={{ background: "linear-gradient(to left, #e66465, #9198e5)", color: 'white', height : 48,textAlign : "center", paddingTop : 10}}>Experience Data Model (XDM) Tool 2.0</div>
        
        {/* Main Container */}
        <div style={{width: '100%', height: '100vh', background: 'blue', display: 'flex'}}>
            {/* Control Panel */}
            <div style={{background: '#DEE2E6', width: '120px', padding: '10px'}}>

                {
                    schemaTypes.map((schemaType, index) => {
                        return <ActionButton key={index} width="100px" marginBottom="10px"
                        UNSAFE_style={{...schemaType.style, color: '#ffffff'}} 
                        onPress={() => onAddSchema(schemaType.type)}>
                            {schemaType.label}
                        </ActionButton>
                    })
                }
                
            </div>

            {/* Left and Right Splitter Pane */}
            <Splitter style={{height: '100%', width: '100%'}} layout="horizontal">
                <SplitterPanel  >
                    <LeftPanel   onWindowAction={(type, index) => onWindowAction(type, index)}
                     onSchemaChange={(e, index,name) => onSchemaChangeHandler(e, index,name)}
                     schemas={schemaObjects} 
                     deleteSchema={(index) => onDeleteSchema(index)}
                    //  schemaDescription = {schemadescription}
                    //  schemaTitle = {schemaTitle}
                     behaviour = {behaviour}
                     updateHandlerFactory = {updateHandlerFactory}
                     addDynamicPropertyRow = {(index)=>addDynamicPropertyRow(index)}
                    //  definitions = {definitions}
                     plusHandlerFactory = {plusHandlerFactory}
                     onClassChange = {(e,index) => onClassChange(e,index)}
                     onmixinChange = {(e,index) => onmixinChange(e,index)}
                     deleteProperty = {deleteProperty}
                     currentIndex = {(index) => setCurrentIndex(index)}
                     schemaName = {schemaName}
                     onMetaStatusChange = {(e)=> onMetaStatusChange(e)}
                     setschemaName = {(e) => setschemaName(e)}
                    //  refreshpage = { () => refreshpage()}
                    //  resumePage = {() => resumePage()}
                    //  setActiveSchema={(index) => setActiveSchema(schemaObjects[index])}

                   />

                </SplitterPanel>
                <SplitterPanel size={22}>
                    {/* {console.log('ACTIVESCHEMA', activeSchema?.jsonData ?? undefined)} */}
                    <RightPanel jsonData={schemaObjects[currentIndex]?.jsonData.class ??undefined} //
                    getobjectfromJson = {(e) => getobjectfromJson(e)}
                    schemaName = {schemaName}
                    behaviour = {behaviour}
                    schemas={schemaObjects} 
                    type =  {schemaObjects[currentIndex]?.type ?? ""}/>
                </SplitterPanel>
            </Splitter>

        </div>

    </>)
}

export default Schema2
