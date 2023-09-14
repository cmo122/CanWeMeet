import React, { useEffect,  useState } from "react";
import { useForm, Controller, useFieldArray, SubmitHandler  } from "react-hook-form";

interface props  {
  register:any
}

type DayData = {
  days:string[]
}

export default function DaySelector({register}:props) {
  const [days, setDays] = useState<string[]>([])
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<DayData>()

    const dayOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
    return (
      <div
        className="flex justify-center items-center">
            {dayOptions.map((day, index) => (
            <div key={index} className="flex flex-col justify-center items-center m-3">
                <h2 className="text-white">{day}</h2>
                <input
                type="checkbox"
                {...register(`days.${index}`)}
                value={day}
                className="w-6 h-6 p-4"
                />
            </div>

         ))}
     </div>
    )
}