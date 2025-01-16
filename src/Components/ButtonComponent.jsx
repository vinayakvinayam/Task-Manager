import React from "react";

import {TouchableOpacity, Text} from "react-native"

export const ButtonComponent = (props) => {
    return (
        <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
        >
          <Text style={{color: "#fff"}}>{props.title}</Text>
        </TouchableOpacity>
    )
}
 


