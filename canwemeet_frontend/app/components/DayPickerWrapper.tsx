import React from "react";
import { DatePicker } from '@mantine/dates';
import { useForm, Controller } from "react-hook-form";


interface props  {
  control:any
}


export default function DayPickerWrapper({control}:any) {
  
    const {
      formState: { errors },
      setValue
    } = useForm()
  
    return (
      <Controller
        name="dates"
        control={control}
        defaultValue={[new Date()]}
        render={({ field }) => (
          <DatePicker
            type="multiple"
            defaultValue={[new Date()]}
            value={field.value}
            onChange={(selectedDates) => {
              setValue('date', selectedDates);
              field.onChange(selectedDates);
            }}
          />
        )}
      />
    );
  }