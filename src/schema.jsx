import React, { useState, useEffect, useReducer } from "react";
import "./schema.css";
import { Octokit } from "@octokit/core";
import { initialObject } from "./xdm";
import EdiText from 'react-editext'

import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

const { createPullRequest } = require("octokit-plugin-create-pull-request");

const Schema = () => {
  const [prTitle, setPrTitle] = useState("");
  const [prBody, setPrBody] = useState("");
  const [prBranch, setPrBranch] = useState("");

  
  const [_schemaType, setSchemaType] = useState("class");
  const [schemaName, setSchemaName] = useState("");

  const [titlemain, setTitle] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [behaviour, setBehaviour] = useState("record");
  const [className, setClassName] = useState("profile");
  const [metaStatus, setmetastatus] = useState("experimental");

  const MyOctokit = Octokit.plugin(createPullRequest);

  const TOKEN = process.env.REACT_APP_TOKEN; // create token at https://github.com/settings/tokens/new?scopes=repo
  const octokit = new MyOctokit({
    auth: TOKEN,
  });

  const schema_Type = ["class", "mixin", "datatype"];
  const behaviours = ["record", "timeseries"];
  const classname = ["profile", "experience event", "product"];
  const types = ["string", "integer", "data-time", "date", "array", "object"];
  const metastatus = ["experimental", "stable"];
  const [labeloption, setlabel] = useState("Behaviour");
  const [valueoption, setvalue] = useState(behaviours);
  const [addProperties, setProperties] = useState('');

  const [xdmObject, setXdmObject] = useState(initialObject({
    schemaType: _schemaType,
    schemaName: schemaName,
    title: titlemain,
    description: description,
    addproperties: addProperties,
    metaStatus: metaStatus,
    behaviour: behaviour,
    className: className
  }));

  const propertyObject = { propertyNamespace: "",   propertyName: "", propertyTitle: "", propertyType: "",  propertyDescription: "",  }; 

  // const addPropertyHandler =({ propertyNamespace: "",   propertyName: "", propertyTitle: "", propertyType: "",  propertyDescription: "",  }) => {
  //   xdmObject.definitions.definationName.properties[" - "] = {
        
  //   };
  // }

  // const addDefinitionHandler = (definationName) => {
  //   xdmObject.definitions.definationName = {
  //     "properties" : {}
  //   };
  // }

  // const nestedPropertyHandler =() => {

  // }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    console.log(e.target.name);

    const list = [...addProperties];
    list[index][name] = value;
    setProperties(list);
    console.log(addProperties);
  };

  const handleObjectInput = (e, index) => {
    const { name, value } = e.target;
    console.log(e.target.name);

    const list = [...addObjectProperties];
    list[index][name] = value;
    setObjectProp(list);
    console.log(addObjectProperties);
  };

  const onSave = (val) => {
    console.log('Edited Value -> ', val)
  }

  const handleAddClick = () => {
    console.log(addProperties);
    setProperties([...addProperties,
      {
        propertyNamespace: propertyNamespace,
        propertyName: propertyName,
        propertyTitle: propertyTitle,
        propertyType: propertyType,
        propertyDescription: propertyDescription,
      },
    ]);
  };

const handleAddObject = () => {
  console.log(addProperties);
    setObjectProp([...addObjectProperties,
      {
        propertyNamespace: propertyNamespace,
        propertyName: propertyName,
        propertyTitle: propertyTitle,
        propertyType: propertyType,
        propertyDescription: propertyDescription,
      },
    ]);
}

  const handledefinationchange = (e,index) =>{
    const { name, value } = e.target;
    const list = [...addDefination];
    list[index][name] = value;
    setDefination(list);
    console.log(addDefination);
  }

  const handleAddDefination = () =>{
    setDefination([...addDefination,{definationName: ''}])
  }

  

  const recursivefields = (propertyObj,i,handleInput) => {
   return <div>
    <br />
    <br />
    <label> Property Namespace </label>
    <input
      type="text"
      name="propertyNamespace"
      value={propertyObj.propertyNamespace}
      onChange={(e) => handleInput(e, i)}
    />{" "}
    <br /> <br />
    <label> Property Name</label>
    <input
      type="text"
      name="propertyName"
      value={propertyObj.propertyName}
      onChange={(e) => handleInput(e, i)}
    />{" "}
    <br /> <br />
    <label> Property Title</label>
    <input
      type="text"
      name="propertyTitle"
      value={propertyObj.propertyTitle}
      onChange={(e) => handleInput(e, i)}
    />{" "}
    <br /> <br />
    <label> Property Type </label>
    <input
      type="text"
      name="propertyType"
      value={propertyObj.propertyType}
      onChange={(e) => handleInput(e, i)}
    />{" "}
    {propertyObj.propertyType === 'object' ? [handleAddObject(),recursivefields(propertyObj,i,handleObjectInput())] : null}
    <label> Property Description </label> <input
                  type="text"
                  name="propertyDescription"
                  value={propertyObj.propertyDescription}
                  onChange={(e) => handleInputChange(e, i)}></input>
    </div>
  }

  const submitPr = () => {
    var details = {
      prTitle: prTitle,
      prBody: prBody,
      prBranch: prBranch,
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
  };
 

  //let labeloption = 'Behaviour', valueoption = behaviours;
  const handleOption = (e) => {
    setSchemaType(e.target.value);
    if (e.target.value === "class") {
      setlabel("Behaviour");
      setvalue(behaviours);
    } else if (e.target.value === "mixin") {
      setlabel("Class Name");
      setvalue(classname);
    }
 
  };

  const handleclass = (e) => {
    if (_schemaType === "class") {
      setBehaviour(e.target.value);
    } else if (_schemaType === "mixin") {
      setClassName(e.target.value);
    }
   
  };

  const createPR = () => {
    console.log(schemaName);
    console.log(prTitle);
    console.log(prBody);
    console.log(prBranch);
    octokit
      .createPullRequest({
        owner: "adobe",
        repo: "xdm",
        title: `${prTitle}`,
        body: `${prBody}`,
        base: "master" /* optional: defaults to default branch */,
        head: `${prBranch}`,
        changes: [
          {
            
            files: {
           
              [`${schemaName}.schema.json`]: {
                content: JSON.stringify(data, undefined, 4),
              },
            },
            commit: `commiting ${schemaName}.schema.json changes`,
          },
        ],
      })
      .then((pr) => {console.log(pr.data.number)
      alert("PR Created")
      setPrTitle('');
      setPrBody('');
      setPrBranch('')
      });
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>XDM Modeling Tool 2.0</h3>

      <div className="split left">
        <div className="centered ">
          <label>Schema Type </label>
          <select onChange={handleOption}>
            {schema_Type.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>{" "}
          <br />
          <br />
          <label>{labeloption}</label>
          <select onChange={handleclass}>
            {valueoption.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>{" "}
          <br />
          <br />
          <label>Schema Name</label>
          <input
            type="text"
            value={schemaName}
            onChange={(e) => {
              setSchemaName(e.target.value);
           
            }}
          />{" "}
          <br /> <br />
          <label>Schema Title</label>
          <input
            type="text"
            value={titlemain}
            onChange={(e) => setTitle(e.target.value)}
          />{" "}
          <br /> <br />
          <label>Schema Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />{" "}
          <br /> <br />
          {addProperties.map((x, i) => {
            return (
             recursivefields(x,i,handleInputChange())
            );
          })}
          <div>
            <br /> <br />
          </div>
          {/* {addDefination.map((x,i)=>{
            return (
              <div><label> Defination Name </label>
              <input
        type="text"
        name="definationName"
        value={x.definationName}
        onChange={(e) => handledefinationchange(e, i)}
      /><br/><br/></div>
            )
          })} */}
          <label>Meta Status </label>
          <select onChange={(e) => setmetastatus(e.target.value)}>
            {metastatus.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>{" "}
          <br />
          <br />
          <button onClick={handleAddClick}>Add Properties</button>{" "}
          &nbsp;&nbsp;&nbsp;
          {/* <button onClick={handleAdddefinitions}>Add Definitions</button> */}
          <br />
          <br />
          {/* <button onClick={submitApi}>Submit</button> */}
          <br />
          <br />
        </div>
      </div>
      <div className="split right">
      {/* {state.isModalOpen && (
        <Modal closeModal={closeModal} modalContent={state.modalContent} />
      )} */}
        <textarea          className="textArea"
          value={JSON.stringify(data, undefined, 4)}> </textarea>
        {/* <br />
        <br /> */}
        {/* <EditTextarea value = {JSON.stringify(data, undefined, 4)} style = {{minWidth : '90%', minHeight : '90%' , outline : 'auto'}}/> */}
        {/* <input type = 'text' value={JSON.stringify(data, undefined, 4)}></input> */}
        {<EdiText
         viewContainerClassName='my-custom-view-wrapper'
  type='textarea'
  inputProps={{
     style: {
      outline: 'auto',
       minWidth: '90%',
      minHeight: '90%',
    
    },
    rows: 100
  }}
  saveButtonContent='Apply'
  showButtonsOnHover= 'true'
  startEditingOnEnter='true'
  editOnViewClick='true'
  
  
  buttonsAlign='before'
        cancelButtonContent={<strong>Cancel</strong>}
        editButtonContent='Edit this code'
  value={<pre>{JSON.stringify(data, undefined, 4)}</pre>}//
   onSave={onSave}
/> }
<br/>
<br/>
        <label> PR Title</label>
        <input
          type="text"
          value={prTitle}
          onChange={(e) => setPrTitle(e.target.value)}
        />{" "}
        <br/>
        <br/>
        <label> PR Description</label>
        <input
          type="text"
          value={prBody}
          onChange={(e) => setPrBody(e.target.value)}
        />{" "}
        <br/>
        <br/>
        <label> PR Branch</label>
        <input
          type="text"
          value={prBranch}
          onChange={(e) => setPrBranch(e.target.value)}
        />{" "}
        &nbsp;&nbsp;&nbsp;
        <br />
        <br />
        &nbsp;&nbsp;&nbsp;
        <button  onClick={() => { createPR(); }}   
        >
             Create PR
        </button>
        &nbsp;&nbsp;&nbsp;
        <br />
        <br />
      </div>
    </div>
  );
};

export default Schema;
