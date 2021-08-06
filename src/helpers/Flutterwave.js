import React, {useEffect} from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { paymentTitle, flutterwaveSecret, flutterwavePublicKey } from '../App.constants';
import stateWrapper from "../containers/provider";
import { config } from '../appConfig';

const Flutterwave = props => {
    // const logo = config?.agnesLogo;
    const title = paymentTitle;
    // const description = paymentDescription;
    const flutterwavPublicKey = flutterwavePublicKey
    // const value = props?.data;
    // const isRecurring = (_.isUndefined(value?.paymentPlanFlutterwave) || _.isNull(value?.paymentPlanFlutterwave)) ? false : true
    console.log(flutterwavPublicKey)
    const configx = {
        public_key: flutterwavPublicKey,
        tx_ref: `${uuidv4()}`,
        amount: '50',
        currency: 'USD',
        payment_options: 'card,mobilemoney,ussd,banktransfer,paga,credit,mpesa,barter',
        customer: {
          email: 'test@gmail.com',
          phone_number: '0708543214',
          name:'test name'
        },
        customizations: {
          title,
        }
    };
    
    const handleFlutterPayment = useFlutterwave(configx);
    
    useEffect(() => {
        if(props.data?.setToPayWithFlutterwave) {
            handleFlutterPayment({
                callback: (response) => {
                   console.log(response);
                   const xy = props.handleSubmit()
                    closePaymentModal() // this will close the modal programmatically
                    const xx = props?.setPayToFalse();
                },
                onClose: () => {
                   const sy =  props?.setPayToFalse();
                },
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props?.data?.setToPayWithFlutterwave])

    return <div/>
}

export default stateWrapper(Flutterwave);


// <Flutterwave handleSubmit={handleSubmit} data={state} setPayToFalse={setPayToFalse}/>
// 