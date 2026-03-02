import React from "react";
import Picker from "emoji-picker-react";
import "./EmojiPicker.css";

const EmojiPickerComponent = ({ onEmojiClick, theme = "light" }) => {
    return (
        <div className="emoji-picker-wrapper">
            <Picker
                onEmojiClick={onEmojiClick}
                theme={theme} // 'light' o 'dark'
                searchDisabled={false}
                skinTonesDisabled={true} // Opcional: simplifica la interfaz
                previewConfig={{ showPreview: false }} // Opcional: quita la barra de previsualización inferior
                width="300px"
                height="400px"
            />
        </div>
    );
};

export default EmojiPickerComponent;