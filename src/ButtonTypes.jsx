import { ActionButton } from '@react-spectrum/button';
import React, { useState, useEffect, useReducer } from "react";

const ButtonTypes = () => {
    const schemaTypes = [
        {type: 'class', label: 'Add Class', style: {background: '#9498DC'}},
        {type: 'mixin', label: 'Add Mixin', style: {background: '#B582A3'}},
        {type: 'dataType', label: 'Add DT', style: {background: '#D66D6C'}}
    ];

    const [classButtonClicked, setClassButtonClicked] = useState(false);

    const onAddClassSchema = () => {

        setClassButtonClicked(true)
    }

    return (
        <div style={{background: '#DEE2E6', width: '120px', padding: '10px'}}>

                {
                    schemaTypes.map((schemaType, index) => {
                        return <ActionButton key={index} width="100px" marginBottom="10px"
                        UNSAFE_style={{...schemaType.style, color: '#ffffff'}} 
                        onPress={() => onAddClassSchema( )}>
                            {schemaType.label}
                        </ActionButton>
                    })
                }
                
            </div>
    )
}

export default ButtonTypes;