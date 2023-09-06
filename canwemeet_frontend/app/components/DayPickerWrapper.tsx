import React, { FormEvent, useEffect, useState } from "react";
import { DatePicker } from '@mantine/dates';


export default function DayPickerWrapper() {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
  
        if (selectedDates.length > 0) {
        const selectedDatesString = selectedDates.map((date) => date.toISOString()).join(',');
        const formData = new FormData();
        formData.append('selectedDate', selectedDatesString);
  
        fetch('http://localhost:3000', {
          method: 'POST',
          body: formData,
        })
            .then((response) => {
              console.log(formData)
          })
            .catch((error) => {
                console.log(error)
          });
      }
    };
  
    return (
      <div id='datepicker-container'>
            <DatePicker
            type="multiple"
            value={selectedDates}
            onChange={setSelectedDates}
            onSubmit={handleSubmit}
          />
      </div>
    );
  }