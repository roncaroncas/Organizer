import { useState } from "react";

// Generic type for form values
type FormValues<T> = {
  [K in keyof T]: T[K];
};

const useForm = <T extends Record<string, any>>(
  initialValues: T,
  formatForAPI?: (values: T) => any // Optional transformation function
) => {
  const [formValues, setFormValues] = useState<FormValues<T>>(initialValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // For date inputs, ensure the format stays correct
    if (type === "date") {
      // Ensure correct format, and pad single digits with 0
      let [year, month, day] = value.split("-")

      if (parseInt(day) == 0 || parseInt(month) == 0 || parseInt(year) == 0){
        return
      }
      
      // Only format month and day if they're 1 digit
      if (month && month.length === 1) month = "0" + month;
      if (day && day.length === 1) day = "0" + day;

      // Rebuild the date string with proper padding
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        [name]: `${year}-${month}-${day}`,
      }));
    } 
    // For time inputs, you may want to handle the time formatting similarly
    else if (type === "time") {
      // No special formatting needed for time (HH:mm), so just update the value
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        [name]: value,
      }));
    } 
    // For checkbox inputs, just update with the checked value
    else if (type === "checkbox") {
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        [name]: checked,
      }));
    } 
    // For other types of inputs, just update the value normally
    else {
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        [name]: value,
      }));
    }
  };

  // If formatForAPI is provided, use it. Otherwise, return formValues as is.
  const getFormattedData = () => {
    return formatForAPI ? formatForAPI(formValues) : formValues;
  };



  const resetForm = () => {
    setFormValues(initialValues);
  };

  const setForm = (newValues: Partial<T>) => {
    setFormValues(prev => ({ ...prev, ...newValues }));
  };

  return {
    formValues,
    handleInputChange,
    getFormattedData,
    resetForm,
    setForm,
  };
};

export default useForm;