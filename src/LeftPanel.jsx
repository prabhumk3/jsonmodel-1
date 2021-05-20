import React, { useState, useEffect, useReducer } from "react";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'bootstrap/dist/css/bootstrap.css';
import IconAdd from '@spectrum-icons/workflow/Add';
import Delete from '@spectrum-icons/workflow/Delete';

import {Button} from '@adobe/react-spectrum'
import {  getFirstValueFromMap,getFirstKeyFromMap } from "./xdm2";
import { ActionButton, DialogTrigger, Flex, Text, TextField, AlertDialog,Picker, Item, Section } from '@adobe/react-spectrum'
import './Dropdown.css';
import DeleteOutline from "@spectrum-icons/workflow/DeleteOutline";
import Minimize from "@spectrum-icons/workflow/Minimize";
import Maximize from "@spectrum-icons/workflow/Maximize";

const LeftPanel = (props) => {

    const renderHighLevelProperty1 = (val, i, plusProperty,mainIndex) => {
        console.log("Object Key =====" + i);
        const objKey = Object.keys(val)[0];
        const objVal = val[objKey];
        const keyValues = objKey.split(":");
        let nestedValues = [];
        if (objVal.type == "object") {
            if (objVal.hasOwnProperty("properties")){
                for (let i2 = 0; i2 < objVal.properties.length; i2++)
                nestedValues.push(renderHighLevelProperty1(objVal.properties[i2], i + "." + i2, true,mainIndex));
            }
            
        }
        return (
            <div style={{ marginLeft: '2.25rem' }}>
                {plusProperty ? <span style={{ marginLeft: '2.25rem' }} ></span> : null}
              
                <Button onClick={props.plusHandlerFactory(i,mainIndex)} width = '10px'><IconAdd/></Button>
              
                <TextField   width= '160px'
                    id="outlined-basic"  variant="outlined" name="propertyNamespace" placeholder = "Property Namespace"
                    defaultValue=''//value={keyValues[0]}
                    value={keyValues[0]}
                    onChange={props.updateHandlerFactory("keyT", i)} />
                <TextField   width= '120px' 
                    id="outlined-basic" placeholder="Property Name" variant="outlined" name="propertyName"
                    value={keyValues[1]}
                    onChange={props.updateHandlerFactory("keyN", i)} />
                <TextField  width= '120px' 
                    id="outlined-basic" placeholder="Property Title" variant="outlined" name="propertyTitle"
                    value={objVal.title}
                    onChange={props.updateHandlerFactory("title", i)} />
                <TextField   width= '150px' 
                    id="outlined-basic" placeholder="Property Data Type" variant="outlined" name="propertyType"
                    value={objVal.type}
                    onChange={props.updateHandlerFactory("type", i)} />
                <TextField  width= '150px'
                    id="outlined-basic" placeholder="Property Description" variant="outlined" name="propertyDescription"
                    value={objVal.description}
                    onChange={props.updateHandlerFactory("description", i)} />
                     <TextField width= '100px' 
                    id="outlined-basic" placeholder ="examples" variant="outlined" name="examples"
                    value={objVal.examples}
                    onChange={props.updateHandlerFactory("examples", i)} />
                     <Button  onClick={clickDeleteFunction( i,mainIndex)} width = '10px'><Delete/></Button>
                     <br/><br/>
               
                {nestedValues.map((nv, ni) => {
                    console.log("nv", ni);
                    return nv
                })}
            </div>
        )
    }

    const clickFunction =(index) => {
        return () => {
            console.log("function index==",index);
            props.currentIndex(index);
            // props.setActiveSchema(index);
        }
    }

    const clickDeleteFunction = ( i,mainIndex) => {
        console.log("delete click call => ", i, mainIndex);
        return () => {
            console.log("delete actual call => ", i, mainIndex);
            props.deleteProperty( i,mainIndex)
        }
    }
   
    const schemaNameTextfield = (obj,index) => {
        let schemaname = obj.jsonData.class.$id
        let val = schemaname.split('/');
       schemaname = val[val.length-1]
       props.setschemaName(schemaname)
     return    <TextField
     placeholder={obj.type === "class" ? "Class Name" : obj.type === "mixin" ? "Mixin Name" : "Datatype Name"}
        name="schemaName"
        id="schemaName"
        width= '100px'
        type="text"
        variant="filled"
        defaultValue={schemaname}
        value = {schemaname}
        onChange={(e) => props.onSchemaChange(e, index, "schemaName")}
    /> 
    }


    return (
        <div style={{  display: 'flex',flexDirection: 'column-reverse', overflow: 'scroll' }}>

            {props.schemas.map((obj, index) => {
                console.log('SCHEMAMAP', obj.jsonData.class.title)
            console.log("index === ",index);
          
                   const propertiesVal = getFirstValueFromMap(obj.jsonData.class.definitions)
                   console.log("propertiessss",propertiesVal);
                if (obj.minimized) {
                    return <div
                    onClick={clickFunction(index)}
                        key={index}
                        style={{
                            border: `5px solid ${obj.type === 'class' ? '#9498DC' : obj.type === 'mixin' ? '#B582A3' : '#D66D6C'}`,
                            height: '100px',
                            minWidth: '300px',
                            background: 'lightgrey',
                            borderRadius: '10px',
                            margin: '20px',
                            padding: '10px'
                        }}>
                         {schemaNameTextfield(obj,index)}
                        <Flex justifyContent="end">
                            <ActionButton width="size-115" marginEnd="size-10"
                                onPress={() => props.onWindowAction(false, index)}
                            >
                                <Maximize />
                            </ActionButton>
                            <DialogTrigger>
                                <ActionButton width="size-115"><DeleteOutline /></ActionButton>
                                <AlertDialog
                                    variant="destructive"
                                    title={`Delete ${obj.type} Schema`}
                                    primaryActionLabel="Delete"
                                    onPrimaryAction={() => props.deleteSchema(index)}
                                    cancelLabel="Cancel">
                                    This will permanently delete the selected Schema. Continue?
                                        </AlertDialog>
                            </DialogTrigger>
                        </Flex>

                    </div>
                } else {
                    return <div
                    onClick={clickFunction(index)}
                        key={index}
                        style={{
                            border: `5px solid ${obj.type === 'class' ? '#9498DC' : obj.type === 'mixin' ? '#B582A3' : '#D66D6C'}`,
                            height: '500px',
                            minWidth: '640px',
                            background: 'lightgrey',
                            borderRadius: '10px',
                            margin: '20px',
                            padding: '10px',
                             overflow: 'scroll',position:'relative'
                        }}>

                        <Flex justifyContent="end">
                            <ActionButton width="size-115" marginEnd="size-10"
                                onPress={() => props.onWindowAction(true, index)}
                            >
                                <Minimize />
                            </ActionButton>
                            <DialogTrigger>
                                <ActionButton width="size-115"><DeleteOutline /></ActionButton>
                                <AlertDialog
                                    variant="destructive"
                                    title={`Delete ${obj.type} Schema`}
                                    primaryActionLabel="Delete"
                                    onPrimaryAction={() => props.deleteSchema(index)}
                                    cancelLabel="Cancel">
                                    This will permanently delete the selected Schema. Continue?
                                        </AlertDialog>
                            </DialogTrigger>
                        </Flex>

                        <div>
                      
                            {schemaNameTextfield(obj,index)}
                            <TextField
                                name="schemaTitle"
                                placeholder={obj.type === "class" ? "Class Title" : obj.type === "mixin" ? "Mixin Title" : "Datatype Title"}
                                variant="filled"
                                width= '100px'
                                defaultValue={obj.jsonData.class.title}
                                value = {obj.jsonData.class.title}
                                onChange={(e) => props.onSchemaChange(e, index, "schemaTitle")} />

                            <TextField
                                name="schemaDescription"
                                placeholder={obj.type === "class" ? "Class Description" : obj.type === "mixin" ? "Mixin Description" : "Datatype Description"}
                                variant="filled"
                                width= '130px'
                                defaultValue={obj.jsonData.class.description}
                                value = {obj.jsonData.class.description}
                                onChange={(e) => props.onSchemaChange(e, index, "schemaDescription")} />

                            {obj.type === "mixin" ?
                            <Picker  width= '160px' onSelectionChange={(e,index) => props.onmixinChange(e,index)} placeholder ="Class Name">
                            <Item key="profile">Profile</Item>
                            <Item key="experience event">Experience event</Item>
                            <Item key="product">Product</Item>
                          </Picker>: null}

                            {obj.type === "class" ?
                            <Picker  width= '120px'  marginTop = '10px' onSelectionChange={(e,index) => props.onClassChange(e,index)} placeholder="Behaviour">
                            <Item key="record">Record</Item>
                            <Item key="timeseries">Timeseries</Item>
                          </Picker>
                           
                                : null}
<Picker  width= '130px'  marginTop = '10px' onSelectionChange={(e) => props.onMetaStatusChange(e)} placeholder="Meta Status">
                           <Item key="experimental">Experimental</Item>
                           <Item key="stable">Stable</Item>
                         </Picker>
                        </div>
                        <br />
                        <div style={{ marginLeft: '2.25rem' }}>
                            <Button variant="contained" onClick={(e) => props.addDynamicPropertyRow(index)} >Add Property</Button>

                            <br /><br />
                            <table>
                                <tbody>
                                    <tr>
                                       {propertiesVal.properties.map((val,index1) => {
                                          return  (renderHighLevelProperty1(val, index1, false,index))
                                        } )}
                                      
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }

            })}


        </div>)


}

export default LeftPanel
