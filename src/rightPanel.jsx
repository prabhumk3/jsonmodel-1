import React, { useEffect, useState } from 'react'
import JSONInput from 'react-json-editor-ajrm'
import locale    from 'react-json-editor-ajrm/locale/en';
import { Octokit } from "@octokit/core";
import { ActionButton, Button } from '@react-spectrum/button';
import { AlertDialog, Dialog, DialogTrigger } from '@react-spectrum/dialog';
import { Heading } from '@react-spectrum/text';
import { Flex } from '@react-spectrum/layout';
import { Header, Divider, Content, Form, Footer, Checkbox, ButtonGroup, Text, TextField} from '@adobe/react-spectrum'
import Alias from '@spectrum-icons/workflow/Alias';
import Minimize from "@spectrum-icons/workflow/Minimize";
import Maximize from "@spectrum-icons/workflow/Maximize";


const RightPanel = (props) => {

    // console.log('RIGHTPANEL', props)
    const [jsonData, setJsonData] = useState({});
    const [minimized , setMinimized] = useState(false)
    // const [definitions, setDefinitions] = useState(getDefaultDefinitions());

    
    const [prTitle, setPrTitle] = useState("");
    const [prBody, setPrBody] = useState("");
    const [prBranch, setPrBranch] = useState("");
    const [prUsername, setPrUsername] = useState("");
    

    const { createPullRequest } = require("octokit-plugin-create-pull-request");
    const MyOctokit = Octokit.plugin(createPullRequest);
    const TOKEN = "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"; // create token at https://github.com/settings/tokens/new?scopes=repo
    const octokit = new MyOctokit({
        auth: TOKEN,
    });

    useEffect(() => {
        if (props.jsonData) {
            // console.log('RIGHTPANEL', props.jsonData)
            
            let jsonString = JSON.stringify(props.jsonData)
            // console.log(jsonString);
            jsonString = jsonString.replace("definitionName",props.schemaName)
            if (props.type === 'mixin'){
                jsonString = jsonString.replace("meta:extends", "meta:intendedToExtend")
            }
            const copy = JSON.parse(jsonString);
            setJsonData(copy)
           
        } else {
            setJsonData(undefined)
        }
    }, [props.jsonData]) 

    const createPR = () => {
        const files= {};
      
        {props.schemas.map((obj,index)=>{ //2
            console.log("obj",obj);
            if (props.behaviour === "" && obj.type === 'mixin'){
                alert('Please select behaviour')
            }else{
                console.log(props.schemaName);
                console.log(obj.type);
                console.log(prBody);
                console.log(prBranch);
                console.log(jsonData);

                let jsonString = JSON.stringify(obj.jsonData.class)
                // console.log(jsonString);
                jsonString = jsonString.replace("definitionName",obj.jsonData.schemaName)
               //path = components/mixins/profile
               let xdmPah = ""
               if (obj.type === 'mixin'){
               
                console.log(obj.jsonData)
                jsonString = jsonString.replace("meta:extends", "meta:intendedToExtend")
                // schemaname = obj.jsonData.class["meta:intendedToExtend"]
                // let val = schemaname.split('/');
                // schemaname = val[val.length-1]
                xdmPah = `components/mixins/${obj.jsonData.behaviour}/${obj.jsonData.schemaName}.schema.json`
            }else{
                xdmPah = `components/classes/${obj.jsonData.schemaName}.schema.json`
            }
            const copy = JSON.parse(jsonString);
            console.log(copy);
            files[xdmPah] = {
                content:  JSON.stringify(copy, null, "\t")  
            };
        
            }
        })}
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
                    files: files,
                    commit: `commiting json file`,
                },
            ],
        })
        .then((pr) => {
            console.log(pr.data.number)
            alert("PR Created")
            setPrTitle('');
            setPrBody('');
            setPrBranch('');
            setPrUsername('');
        });
        
    };

  

    const onWindowAction = (val) => {
        setMinimized(val)
    }
    
    function IsValidJSONString(str) {
        try {
            JSON.parse(JSON.stringify(str));
        } catch (e) {
            return false;
        }
        return true;
    }

    const onChangeJson = (e)  => {
        const validjson = IsValidJSONString(e)
            if (validjson){
                 return  props.getobjectfromJson(e)
            }
        
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', margin: '5px' ,backgroundColor : '#1E1E1E' }}>
        {!minimized ? <div >
        <div style={{position: 'absolute', right: '30px', bottom: '10px', margin: '10px', zIndex: '10'}}>
        <ActionButton width="size-115" marginEnd="size-10"
                                onPress={() => onWindowAction(true)}
                            >
                                <Minimize/>
                            </ActionButton>
            <DialogTrigger>
            
                <ActionButton width="size-100"><Alias></Alias></ActionButton>
                {(close) => (
                    <Dialog>
                    <Heading>
                        <Flex alignItems="center" gap="size-100">
                        {/* <Book size="S" /> */}
                        <Text>Create a Pull Request</Text>
                        </Flex>
                    </Heading>

                    <Divider />
                    <Content>
                        <Form>
                        <TextField label="Title" placeholder="Pull Request Title" autoFocus  onChange={setPrTitle} />
                        <TextField label="Description" placeholder="Pull Request Description" onChange={setPrBody} />
                        <TextField label="Branch" placeholder="main" onChange={setPrBranch}/>
                        <TextField label="Username" placeholder="mprabhak@adobe.com" onChange={setPrUsername} />
                        </Form>
                    </Content>
                    <Footer>
                        {/* <Checkbox>
                        I want to receive updates for exclusive offers in my area.
                        </Checkbox> */}
                    </Footer>
                    <ButtonGroup>
                        <Button variant="secondary" onPress={close}>
                        Cancel
                        </Button>
                        <Button variant="cta" onPress={close} onPress={() => {createPR(); }}>
                        Create
                        </Button>
                    </ButtonGroup>
                    </Dialog>
                )}
            </DialogTrigger>
            
        
        </div>
        <JSONInput
            id="json-panel-1"
            placeholder={ jsonData ?? {}} // data to display
            locale={locale}
            confirmGood={false}
            // reset={true}
            width="100%"
            height="100%"
            onChange = {(e) => onChangeJson(e.jsObject)}
            colors={{
                string: "#DAA520" // overrides theme colors with whatever color value you want
            }}
            // height="100%"
        />
        
    </div> : <div> <ActionButton width="size-115" marginEnd="size-10"
                                onPress={() => onWindowAction(false)}
                            >
                                <Maximize/>
                            </ActionButton></div>}
        </div>
    )
}

export default RightPanel
