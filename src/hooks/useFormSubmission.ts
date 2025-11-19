import type { UseFormReturn, FieldValues } from 'react-hook-form';

/**
 * Custom hook for handling form submission logic
 * @param handleSubmit - The handleSubmit function from react-hook-form
 * @param handleFormSubmit - The function to call when form is valid
 * @returns Object with submitForm and saveForm methods
 */
export const useFormSubmission = <T extends FieldValues = FieldValues>(
  handleSubmit: UseFormReturn<T>['handleSubmit'],
  handleFormSubmit: (data: T) => void
) => {
  const submitForm = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const handleValidSubmit = (data: T) => {
        handleFormSubmit(data);
        resolve(true);
      };

      const handleInvalidSubmit = () => {
        resolve(false);
      };

      handleSubmit(handleValidSubmit, handleInvalidSubmit)();
    });
  };

  const saveForm = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const handleValidSubmit = (data: T) => {
        handleFormSubmit(data);
        resolve(true);
      };

      const handleInvalidSubmit = () => {
        resolve(false);
      };

      handleSubmit(handleValidSubmit, handleInvalidSubmit)();
    });
  };

  return {
    submitForm,
    saveForm,
  };
};