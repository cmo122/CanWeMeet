import DaySelector from '@/app/components/DaySelector';
import DayPickerWrapper from '@/app/components/DayPickerWrapper';
import { Group } from '@mantine/core';
import { useAppSelector } from './redux/hooks';
import { useForm} from "react-hook-form";

interface props  {
    control:any
}
  
export default function DateSelectorElement({control}:props) {
    const dateView = useAppSelector((state) => state.dateView);

    const {
        formState: { errors },
      } = useForm()

    return (
        <Group position="center">
            {dateView === 'dates' && (
                <DayPickerWrapper control={control} view={dateView} />
            )}
            {dateView === 'days' && (
            <DaySelector control={control} view={dateView}/>
            )}
        </Group>
    )
}