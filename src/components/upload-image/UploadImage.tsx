import {AddIcon} from "@chakra-ui/icons";
import {Flex, IconButton, Image, Input, Text} from "@chakra-ui/react";
import styled from "styled-components";

const ImageUploader = ({value, setValue}) => {

  return (
      <>
        <Flex alignItems="center" justifyContent="space-between">
          <IconButton
              aria-label="Upload file"
              icon={<AddIcon/>}
              onClick={() => {
                const fileInput = document.getElementById('fileInput');
                if (fileInput) {
                  fileInput.click();
                }
              }}
          >
          </IconButton>
        </Flex>

        <Flex alignItems="center" mt={4}>
          <Text mr={2}>
            {value === null && "Upload"}
          </Text>
          {value !== null && value !== "" &&
              <ImagePreview className="image-preview-container">
                <div className="image-preview">
                  <Image
                      src={value.toString().includes("http") ? value : URL.createObjectURL(value)}
                      boxSize='150px'/>
                  <button className="remove-image-button" type="button" onClick={() => {
                    setValue(null)
                  }}>
                    x
                  </button>
                </div>
              </ImagePreview>
          }
        </Flex>
        <Input id="fileInput" type="file" display="none"
               accept="image/*,video/*,.gif"
               onChange={(event) => {
                 const file = event.target.files?.[0];
                 if (file) {
                   setValue(file)
                 }
               }}/>
      </>
  )
}

const ImagePreview = styled.div`.remove-image-button {
  background-color: #f44336;
  position: absolute;
  top: 0;
  right: 0;
  color: rgb(255, 255, 255);
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  font-size: 20px;
}

  .image-preview {
    display: inline-block;
    position: relative;
  }

  .image-preview img {
    height: auto;
    object-fit: cover;
  }`
export default ImageUploader;
