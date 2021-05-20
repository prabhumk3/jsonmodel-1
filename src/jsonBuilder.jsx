import React, { useState, useEffect, useReducer } from "react";
import "./schema.css";
import { Octokit } from "@octokit/core";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'bootstrap/dist/css/bootstrap.css';
import { addPropertyHandler, finalJsonOutput, getDefaultDefinitions, getDefaultJson, initialObject, plusHandler, updateValue, deleteProp } from "./xdm2";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import TextField from "@material-ui/core/TextField";
import { Splitter, SplitterPanel } from 'primereact/splitter';
import DeleteIcon from '@material-ui/icons/Delete';

import EdiText  from 'react-editext';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { Editor } from 'primereact/editor';
import { InputTextarea } from 'primereact/inputtextarea';


import { Dropdown } from 'primereact/dropdown';
import './Dropdown.css';

// import JSONInput from 'react-json-editor-ajrm';
// import locale    from 'react-json-editor-ajrm/locale/en';
import RightPanel from "./rightPanel";

const { createPullRequest } = require("octokit-plugin-create-pull-request");

const onSave = (val) => {
    console.log('Edited Value -> ', val)
  }

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


const Schema = () => {
    const classes = useStyles();


    const [prTitle, setPrTitle] = useState("");
    const [prBody, setPrBody] = useState("");
    const [prBranch, setPrBranch] = useState("");
    const [prUsername, setPrUsername] = useState("");

    const [_schemaType, setschemaType] = useState('Class')
    const [schemaName, setschemaName] = useState('');
    const [schemaTitle, setTitleMain] = useState('');
    const [schemadescription, setdescription] = useState('');
    const [metaStatus, setmetastatus] = useState('');
    const [behaviour, setbehaviour] = useState('');
    const [clazzName, setClazzName] = useState('')

    const [labelSchemaName, setlabelSchemaName] = useState('Class Name');
    const [labelSchematitle, setlabelSchemaTitle] = useState('Class Title');
    const [labelschemaDescription, setlabelSchemaDescription] = useState('Class Description');
    const [labelBehaviour, setlabelBehaviour] = useState('Behaviour');
    const [classColor, setclasscolor] = useState('primary');
    const [mixinColor, setmixincolor] = useState('');
    const [datatypeColor, setdatatypecolor] = useState('');
    const [definitions, setDefinitions] = useState(getDefaultDefinitions());

    const [className, setClassName] = useState("");
  
    const [mixinBehaviour, setMixinBehaviour] = useState('');
    const classess = [
        { name: 'profile'},
        { name: 'experience event' },
        {name : 'product'}
    ];

    const behaviourVal = [
        { name: 'record'},
        { name: 'timeseries' }
    ];
    const onClassChange = (e) => {
        console.log(e.value.name);
        setClassName(e.value);
        setbehaviour(e.value.name)
    }

    const onmixinChange = (e) => {
        setMixinBehaviour(e.value);
        setbehaviour(e.value.name)
    }

    const MyOctokit = Octokit.plugin(createPullRequest);

    const TOKEN = "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"; // create token at https://github.com/settings/tokens/new?scopes=repo
    const octokit = new MyOctokit({
        auth: TOKEN,
    });

    const createPR = () => {
        console.log(schemaName);
        console.log(prTitle);
        console.log(prBody);
        console.log(prBranch);
        console.log(prUsername);
        octokit
            .createPullRequest({
                owner: "adobe",
                repo: "xdm",
                title: `${prTitle} Created by ${prUsername}`,
                body: `${prBody} `,
                base: "master" /* optional: defaults to default branch */,
                head: `${prBranch}`,
                changes: [
                    {

                        files: {

                            [`${schemaName}.schema.json`]: {
                                content: JSON.stringify(finalJsonOutput(definitions, jsonData), undefined, 4),
                            },
                        },
                        commit: `commiting ${schemaName}.schema.json changes`,
                    },
                ],
            })
            .then((pr) => {
                console.log(pr.data.number)
                alert("PR Created")
                setPrTitle('');
                setPrBody('');
                setPrBranch('')
            });
    };


    const jsonData = {
        schemaType: _schemaType,
        schemaName: schemaName,
        title: schemaTitle,
        description: schemadescription,
        metaStatus: metaStatus,
        behaviour: behaviour,
        clazzName: clazzName,
        definition : definitions
    };

    const handleInputChange = (e, changingProp, objKey) => {
        const { name, value } = e.target;
        console.log(e.target.name);
        const newDefinitions = updateValue(definitions, objKey, changingProp, value);
        setDefinitions({ "CLAZZ": newDefinitions.CLAZZ });
    };

    const handlePlusChange = (e, objKey) => {
        console.log(e.target.name);
        const newDefinitions = plusHandler(definitions, objKey);
        setDefinitions({ "CLAZZ": newDefinitions.CLAZZ });
    };

    const updateHandlerFactory = (changingProp, objKey) => {
        return (e) => {
            handleInputChange(e, changingProp, objKey);
        }
    }

    const plusHandlerFactory = (objKey) => {
        return (e) => {
            handlePlusChange(e, objKey);
        }
    }

    const addDynamicPropertyRow = () => {
        console.log("clicked add properties");
        const newDefinitions = addPropertyHandler(definitions);
        setDefinitions({ "CLAZZ": newDefinitions.CLAZZ });
    }

    const deleteProperty = (jsonObject, i) => {
        const result = deleteProp(jsonObject, i);
        setDefinitions({ "CLAZZ": result.CLAZZ })
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
                <Fab size="small" aria-label="Add" className={classes.margin} onClick={plusHandlerFactory(i)}>
                    <AddIcon />
                </Fab>
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }} id="outlined-basic" label="Property Namespace" variant="outlined" name="propertyNamespace"
                    value={keyValues[0]}
                    onChange={updateHandlerFactory("keyT", i)} />
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }} id="outlined-basic" label="Property Name" variant="outlined" name="propertyName"
                    value={keyValues[1]}
                    onChange={updateHandlerFactory("keyN", i)} />
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }} id="outlined-basic" label="Property Title" variant="outlined" name="propertyTitle"
                    value={objVal.title}
                    onChange={updateHandlerFactory("title", i)} />
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }} id="outlined-basic" label="Property Data Type" variant="outlined" name="propertyType" 
                    value={objVal.type} 
                    onChange={updateHandlerFactory("type", i)}/>
                <TextField InputProps={{ className: classes.input }} InputLabelProps={{ shrink: true }} id="outlined-basic" label="Property Description" variant="outlined" name="propertyDescription"
                    value={objVal.description}
                    onChange={updateHandlerFactory("description", i)} />
                <IconButton style={{width: '50px'}} aria-label="Delete" className={classes.margin} onClick={() => deleteProperty(definitions, i)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
                {nestedValues.map((nv, ni) => {
                    // console.log("nvddddd",ni);
                    return nv
                })}
            </div>
        )
    }

    const getLabelNamesMixin = () => {
        setlabelSchemaDescription('Mixin Description');
        setlabelSchemaName('Mixin Name');
        setlabelSchemaTitle('Mixin Title');
        setlabelBehaviour('Class Name');
        setschemaType('Mixin')
        setclasscolor('');
        setmixincolor('primary')
        setdatatypecolor('');
    }


    
const getLabelNamesClass = () => {
        setlabelSchemaDescription('Class Description');
        setlabelSchemaName('Class Name');
        setlabelSchemaTitle('Class Title');
        setlabelBehaviour('Behaviour')
        setschemaType('Class')
        setclasscolor('primary')
        setmixincolor('');
        setdatatypecolor('');
    }

    const getLabelNamesDataType = () => {
        setlabelSchemaDescription('Datatype Description');
        setlabelSchemaName('Datatype Name');
        setlabelSchemaTitle('Datatype Title');
        setschemaType('DataType')
        setclasscolor('');
        setmixincolor('');
        setdatatypecolor('primary');
    }


    return (

        <div >

            <span className="border border-secondary" >
                <div style={{ backgroundColor: "coral", height : 48,textAlign : "center", paddingTop : 10}}>Experience Data Model (XDM) Tool</div>
                <div>
                    <Grid container alignItems="top" className={classes.root}>
                     
                        <Divider orientation="vertical" flexItem />
                        
                        <div className="card" style={{width: '100%'}}>
                     
                            <Splitter style={{ height: '100%'}} className="p-mb-5">
                                <SplitterPanel  className="p-d-flex p-ai-center p-jc-center" size={1    } minSize={1} style= {{backgroundColor: 'lightgray'}}><div style = {{width:100}}>
                                <Button variant="contained" color={classColor} className={classes.button} onClick={getLabelNamesClass}>
                                    Class
                                </Button><br />
                                <Button variant="contained" color={mixinColor} className={classes.button} onClick={getLabelNamesMixin}>
                                    Mixin
                                </Button><br />
                                <Button variant="contained" color={datatypeColor} className={classes.button} onClick={getLabelNamesDataType}>
                                    Datatype
                                </Button><br />
                        </div>
                            </SplitterPanel>
                            <SplitterPanel width="479px" className="p-d-flex p-ai-center p-jc-center" >
                                    <div className={classes.root} >  <TextField
                                        label={labelSchemaName} variant="filled" value={schemaName} onChange={(e) => setschemaName(e.target.value)} />
                                        <TextField
                                            label={labelSchematitle} variant="filled" value={schemaTitle} onChange={(e) => setTitleMain(e.target.value)} />
                                        <TextField
                                            label={labelschemaDescription} variant="filled" value={schemadescription} onChange={(e) => setdescription(e.target.value)} />

{/* {labelSchemaName !== "Datatype Name" ?<div>  <FormControl variant="filled" className={classes.formControl}>
                                            <InputLabel id="demo-simple-select-filled-label">{labelBehaviour}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-filled-label"
                                                id="demo-simple-select-filled"
                                                value={behaviour}
                                                onChange={(e) => setbehaviour(e.target.value)}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {labelSchemaName === 'Class Name' ? <div>
                                                    <MenuItem value=
                                                        {"record"}>record</MenuItem>
                                                    <MenuItem value={'timeseries'}>timeseries</MenuItem></div> : null}
                                                {labelSchemaName === 'Mixin Name' ? <div><MenuItem value={'profile'}>profile</MenuItem>
                                                    <MenuItem value={"experience event"}>experience event</MenuItem>
                                                    <MenuItem value={"product"}>product</MenuItem></div> : null}
                                               

                                            </Select>
                                        </FormControl><br /></div>: null} */}
                                        {labelSchemaName === "Class Name" ? <div className="dropdown-demo" style  = {{marginLeft : 10}}>
            {/* <div className="card"> */}
                
                {/* <Dropdown value={className} options={classess} onChange={onClassChange} optionLabel="name" placeholder="Class Name" /> */}
                <Dropdown value={mixinBehaviour} options={behaviourVal} onChange={onmixinChange} optionLabel="name" placeholder="Behaviour" />
<br/><br/>
            {/* </div> */}
        </div> : null}

        {labelSchemaName === "Mixin Name" ? <div className="dropdown-demo" style  = {{marginLeft : 10}}>
            {/* <div className="card"> */}
                
                <Dropdown value={className} options={classess} onChange={onClassChange} optionLabel="name" placeholder="Class Name" />
                {/* <Dropdown value={mixinBehaviour} options={behaviourVal} onChange={onmixinChange} optionLabel="name" placeholder="Behaviour" /> */}
                <br/><br/>
            {/* </div> */}
        </div> : null}      


                                        <Button variant="contained" onClick={(e) => addDynamicPropertyRow()} >
                                            Add Property
                                        </Button><br /><br />

                                        <table>
                                            <tbody>

                                                <tr>{definitions.CLAZZ.properties.map((val, index) => (
                                                    renderHighLevelProperty1(val, index, false)
                                                ))}</tr>


                                            </tbody>
                                        </table>
                                    </div>
                                </SplitterPanel>
                                <SplitterPanel className="p-d-flex p-ai-center p-jc-center">
                                    {/* <pre>{JSON.stringify(finalJsonOutput(definitions, jsonData), undefined, 4)}</pre> */}
                                    {/* <EdiText
         viewContainerClassName='my-custom-view-wrapper'
  type='textarea'
  inputProps={{
    className: 'textarea',
    style: {outline: 'auto',minWidth: '100%', minHeight: 'auto',},
    rows: 100
  }}
    saveButtonContent='Apply'
    showButtonsOnHover= 'true'
    startEditingOnEnter='true'
    editOnViewClick='true'
    buttonsAlign='before'
    cancelButtonContent={<strong>Cancel</strong>}
    editButtonContent='Edit this code'
    value={JSON.stringify(finalJsonOutput(definitions, jsonData), undefined, 4)}  
   onSave={onSave}/> */}

                                    {/* <JSONInput
                                        placeholder={finalJsonOutput(definitions, jsonData)} // data to display
                                        //   theme="light_mitsuketa_tribute"
                                        locale={locale}
                                        colors={{
                                            string: "#DAA520" // overrides theme colors with whatever color value you want
                                        }}
                                        height="550px"
                                    /> */}
                                    <RightPanel jsonData={finalJsonOutput(definitions, jsonData)}/>
                                    
                                </SplitterPanel>
                            </Splitter>
                        </div>
                    </Grid>

                </div>
            </span>
            <br/>
          <div style = {{marginLeft : 48}}>
            <TextField id="outlined-basic" label="PR Title" variant="outlined" 
                  value={prTitle}
                  onChange={(e) => setPrTitle(e.target.value)}/>
            
            &nbsp;
             <TextField  id="outlined-basic" label="PR Description" variant="outlined" 
                 value={prBody}
                 onChange={(e) => setPrBody(e.target.value)}/>
            &nbsp;
            <TextField  id="outlined-basic" label="PR Branch" variant="outlined" 
                  value={prBranch}
                  onChange={(e) => setPrBranch(e.target.value)}/>
        
        &nbsp;
            <TextField   id="outlined-basic" label="Username" variant="outlined" 
                  value={prUsername}
                  onChange={(e) => setPrUsername(e.target.value)}/>
        
           
        &nbsp;
           <Button variant="contained"   onClick={() => { createPR(); }}>Create PR</Button>
                
        &nbsp;&nbsp;&nbsp;
            <br />
            <br />
            </div>
        </div>
    );
};

export default Schema;
