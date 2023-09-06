import DaySelector from '@/app/components/DaySelector';
import DayPickerWrapper from '@/app/components/DayPickerWrapper';
import { Group } from '@mantine/core';
import { useAppSelector } from './redux/hooks';

export default function DateSelectorElement() {
    const dateView = useAppSelector((state) => state.dateView);
    return (
        <Group position="center">
            {dateView === 'dates' && (
                <DayPickerWrapper/>
                )}
                {dateView === 'days' && (
                <DaySelector/>
                )}
        </Group>
    )
}