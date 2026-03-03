import React from "react";
import Picker from "emoji-picker-react";
import "./EmojiPicker.css";

const EmojiPickerComponent = ({ onEmojiClick, theme = "light" }) => {
    return (
        <div className="emoji-picker-wrapper">
            <Picker
                onEmojiClick={onEmojiClick}
                theme={theme}
                searchDisabled={false}
                skinTonesDisabled={true}
                previewConfig={{ showPreview: false }}
                width="300px"
                height="400px"
            />
        </div>
    );
};

export default EmojiPickerComponent;