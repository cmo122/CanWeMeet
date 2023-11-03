import Event from "@/app/components/Event";
import { Provider } from 'react-redux';
import store from '../app/components/redux/store';

export default function EventSection() {

    return (
      <Provider store={store}>
        <Event/>
      </Provider>
    )
}