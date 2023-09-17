import React, { useEffect,  useState } from "react";
import { useForm, Control, Controller } from "react-hook-form";

interface props  {
  control: Control
  view:string
}

type DayData = {
  days:string[]
}

export default function DaySelector({ control, view }: props) {
  
  const [dayOptions, setDayOptions]=useState(['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'])

  const {
    handleSubmit,
    register,
    unregister,
    formState: { errors },
  } = useForm<DayData>()

  useEffect(() => {
    
      return () => {
        if (view === "dates") {
          unregister("days")
          }
      }
    },[view,unregister])

  if (view === "days") {
    return (
      <Controller
        {...register(`days`)}
        control={control}
        render={({ field }) => (
          <div className="flex justify-center items-center">
            {dayOptions.map((day, index) => (
              <div key={index} className="flex flex-col justify-center items-center m-3">
                <h2 className="text-white">{day}</h2>
                <input
                  type="checkbox"
                  {...field}
                  value={day}
                  checked={Array.isArray(field.value) && field.value.includes(day)}
                  onChange={(e) => {
                    const checkedDay = e.target.value;
                    const updatedDays = Array.isArray(field.value)
                      ? field.value.includes(checkedDay)
                        ? field.value.filter((selectedDay) => selectedDay !== checkedDay)
                        : [...field.value, checkedDay]
                      : [checkedDay];
                    field.onChange(updatedDays); // Update the field's value
                  }}
                  className="w-6 h-6 p-4"
                />
              </div>
            ))}
          </div>
        )}
      />
    );
  } else {
    return null;
  }
}