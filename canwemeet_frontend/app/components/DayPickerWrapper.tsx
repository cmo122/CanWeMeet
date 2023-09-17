import React, {useEffect} from "react";
import { DatePicker } from '@mantine/dates';
import { useForm, Controller, Control } from "react-hook-form";


interface props  {
  control: Control
  view: string
}


export default function DayPickerWrapper({ control,view}:props) {

    const {
      formState: { errors },
      setValue,
      register,
      unregister
    } = useForm()
  
  useEffect(() => {
    
      return () => {
        if (view === "days") {
          unregister("dates")
          }
      }
    },[view,unregister])
  
    if (view === "dates") {
      return (
        <Controller
          control={control}
          {...register(`dates`)}
          render={({ field }) => (
            <DatePicker
              type="multiple"
              defaultValue={[new Date()]}
              value={field.value}
              onChange={(selectedDates) => {
                setValue("date", selectedDates);
                field.onChange(selectedDates);
              }}
            />
          )}
        />
      );
    } else {
      return null;
    }
  }