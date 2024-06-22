// SaveProductButton.tsx
import { Button } from "@chakra-ui/react";

const SaveProductButton = ({ onSave, isDisabled }) => {
  return (
      <Button
          isLoading={false}
          loadingText='Loading'
          colorScheme='teal'
          variant='outline'
          spinnerPlacement='end'
          onClick={onSave}
          isDisabled={isDisabled}
      >
        Save
      </Button>
  );
};

export default SaveProductButton;