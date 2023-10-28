import React, {useEffect} from "react";
import { DatePicker } from '@mantine/dates';
import { Group } from "@mantine/core";
import { useForm, Controller, Control } from "react-hook-form";
import '../styles/calendar.css'


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
          render={({ field }) => {
            return(
              <Group>
                <DatePicker
                  type="multiple"
                  defaultValue={[new Date()]}
                  value={field.value}
                  size="xs"
                  className='mobile'
                  onChange={(selectedDates) => {
                    setValue("date", selectedDates);
                    field.onChange(selectedDates);
                  }}
                />
                <DatePicker
                  type="multiple"
                  defaultValue={[new Date()]}
                  value={field.value}
                  size="sm"
                  className='desktop'
                  onChange={(selectedDates) => {
                    setValue("date", selectedDates);
                    field.onChange(selectedDates);
                  }}
                />
              </Group>
            )
          }}
        />
      );
    } else {
      return null;
    }
  }