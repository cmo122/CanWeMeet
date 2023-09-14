import DaySelector from '@/app/components/DaySelector';
import DayPickerWrapper from '@/app/components/DayPickerWrapper';
import { Group } from '@mantine/core';
import { useAppSelector } from './redux/hooks';

interface props  {
    register: any
    control:any
}
  
export default function DateSelectorElement({register,control}:props) {
    const dateView = useAppSelector((state) => state.dateView);
    return (
        <Group position="center">
            {dateView === 'dates' && (
                <DayPickerWrapper control={control}/>
                )}
                {dateView === 'days' && (
                <DaySelector register={register}/>
                )}
        </Group>
    )
}