import React, { useState, useEffect, useReducer } from "react";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'bootstrap/dist/css/bootstrap.css';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
// import TextField from "@material-ui/core/TextField";
import DeleteIcon from '@material-ui/icons/Delete';
import { addPropertyHandler, finalJsonOutput, getDefaultDefinitions, getDefaultJson, initialObject, plusHandler, updateValue, deleteProp } from "./xdm2";
import { Dropdown } from 'primereact/dropdown';
import { ActionButton, DialogTrigger, Flex, Text, TextField, AlertDialog } from '@adobe/react-spectrum'
import './Dropdown.css';
import DeleteOutline from "@spectrum-icons/workflow/DeleteOutline";
import Minimize from "@spectrum-icons/workflow/Minimize";
import Maximize from "@spectrum-icons/workflow/Maximize";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: 167
        }
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

    button: {
        margin: theme.spacing.unit,
        width: 80,
    },
    input: {
        // display: 'none',
        height: 28
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 140,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const ClassComponent = (props) =>{

    const classes = useStyles();
    const [addClasses, setClasses] = useState([]);
    const [className, setClassName] = useState("");

    const classess = [
        { name: 'profile' },
        { name: 'experience event' },
        { name: 'product' }
    ];

    const onClassChange = (e) => {
        console.log(e.value.name);
        setClassName(e.value);
        props.setbehaviour(e.value.name)
    }
    const renderHighLevelProperty1 = (val, i, plusProperty) => {
        console.log("Object Key =====" + i);
        const objKey = Object.keys(val)[0];
        const objVal = val[objKey];
        const keyValues = objKey.split(":");
        let nestedValues = [];
        if (objVal.type == "object") {
            for (let i2 = 0; i2 < objVal.properties.length; i2++)
                nestedValues.push(renderHighLevelProperty1(objVal.properties[i2], i + "." + i2, true));
        }
        return (
            <div style={{ marginLeft: '2.25rem' }}>
                {plusProperty ? <span style={{ marginLeft: '2.25rem' }} ></span> : null}
                <Fab size="small" aria-label="Add" className={classes.margin} onClick={props.plusHandlerFactory(i)}>
                    <AddIcon />
                </Fab>
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }}
                    id="outlined-basic" label="Property Namespace" variant="outlined" name="propertyNamespace"
                    defaultValue = ''//value={keyValues[0]}
                    onChange={props.updateHandlerFactory("keyT", i)} />
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }}
                    id="outlined-basic" label="Property Name" variant="outlined" name="propertyName"
                    value={keyValues[1]}
                    onChange={props.updateHandlerFactory("keyN", i)} />
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }}
                    id="outlined-basic" label="Property Title" variant="outlined" name="propertyTitle"
                    value={objVal.title}
                    onChange={props.updateHandlerFactory("title", i)} />
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }}
                    id="outlined-basic" label="Property Data Type" variant="outlined" name="propertyType"
                    value={objVal.type}
                    onChange={props.updateHandlerFactory("type", i)} />
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }}
                    id="outlined-basic" label="Property Description" variant="outlined" name="propertyDescription"
                    value={objVal.description}
                    onChange={props.updateHandlerFactory("description", i)} />
                <IconButton style={{ width: '50px' }} aria-label="Delete" className={classes.margin}
                    onClick={() => props.deleteProperty(definitions, i)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
                {nestedValues.map((nv, ni) => {
                    console.log("nv", ni);
                    return nv
                })}
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
              <div   
        // onClick={() => props.setActiveSchema(index)}
        // key={index}
        style={{
            border: `5px solid #9498DC  `,//${obj.type === 'class' ? '' : obj.type === 'mixin' ? '#B582A3' : '#D66D6C'}`,
            height: '500px',
            minWidth: '800px',
            background: 'lightgrey',
            borderRadius: '10px',
            margin: '20px',
            padding: '10px'
        }}> 
           <TextField
                                label="Class Name"//{obj.type === "class" ? "Class Name" : obj.type === "mixin" ? "Mixin Name" : "Datatype Name"}
                                name="schemaName"
                                id="schemaName"
                                type="text"
                                variant="filled"
                                defaultValue=''
                                onChange={(e) => props.onJRTESTChange(e, index, "schemaName")}
                            />

                            <TextField
                                name="schemaTitle"
                                label="Class Name"//{obj.type === "class" ? "Class Title" : obj.type === "mixin" ? "Mixin Title" : "Datatype Title"}
                                variant="filled"
                                defaultValue=''
                                onChange={(e) => props.onJRTESTChange(e, index, "schemaTitle")} />

                            <TextField
                                name="schemaDescription"
                                label="Class Name"//{obj.type === "class" ? "Class Description" : obj.type === "mixin" ? "Mixin Description" : "Datatype Description"}
                                variant="filled"
                                defaultValue=''
                                onChange={(e) => props.onJRTESTChange(e, index, "schemaDescription")} />
<div className="dropdown-demo" >
                                    <Dropdown value={className}
                                        options={classess}
                                        onChange={onClassChange}
                                        optionLabel="name"
                                        placeholder="Class Name" />
                                    <br /><br />
                                </div>
                            {/* <TextField 
                                label="Class Description" 
                                variant="filled" 
                                defaultValue={obj.jsonData.key} 
                                onChange={(e) => props.onJRTESTChange(e, index)}/> */}
                            {/* {obj.type === "class" ?
                                 : null}
                            {obj.type === "mixin" ?
                                <div className="dropdown-demo" style={{ marginLeft: 10 }}>
                                    <Dropdown value={mixinBehaviour}
                                        options={behaviourVal}
                                        onChange={onmixinChange}
                                        optionLabel="name"
                                        placeholder="Behaviour" />
                                    <br /><br />
                                </div> : null}
                                <div style={{ marginLeft: '2.25rem' }}> */}
                            <Button variant="contained" onClick={(e) => props.addDynamicPropertyRow()} >Add Property</Button>

                            <br /><br />
                            <table>
                                <tbody>
                                    <tr>{props.definitions.CLAZZ.properties.map((val, index) =>
                                        (renderHighLevelProperty1(val, index, false)))}
                                    </tr>
                                </tbody>
                            </table>
                        {/* </div> */}
                      
        </div>
            </div>
      )
// return (<div>HELLLOOO<  /div>)
}

export default ClassComponent;







// <div
//                         onClick={() => props.setActiveSchema(index)}
//                         key={index}
//                         style={{
//                             border: `5px solid ${obj.type === 'class' ? '#9498DC' : obj.type === 'mixin' ? '#B582A3' : '#D66D6C'}`,
//                             height: '100px',
//                             minWidth: '300px',
//                             background: 'lightgrey',
//                             borderRadius: '10px',
//                             margin: '20px',
//                             padding: '10px'
//                         }}>
//                         <Flex justifyContent="end">
//                             <ActionButton width="size-115" marginEnd="size-10"
//                                 onPress={() => props.onWindowAction(false, index)}
//                             >
//                                 <Maximize />
//                             </ActionButton>
//                             <DialogTrigger>
//                                 <ActionButton width="size-115"><DeleteOutline /></ActionButton>
//                                 <AlertDialog
//                                     variant="destructive"
//                                     title={`Delete ${obj.type} Schema`}
//                                     primaryActionLabel="Delete"
//                                     onPrimaryAction={() => props.deleteSchema(index)}
//                                     cancelLabel="Cancel">
//                                     This will permanently delete the selected Schema. Continue?
//                                         </AlertDialog>
//                             </DialogTrigger>
//                         </Flex>

//                     </div> 