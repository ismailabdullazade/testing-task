import { FC, useContext } from 'react';

import { ReactComponent as RubelIcon } from '@/assets/images/icons/iconRubel.svg';
import { ReactComponent as AddBalance } from '@/assets/images/icons/addBalance.svg';
import { UserContext } from '@/store/contexts/UserContext';

import styles from './user-balance.module.scss';
import { AddPayment, AddPaymentModel } from '@/services/ApplicationsService';


const UserBalance: FC = () => {
	// const user = useContext(UserContext);

    const paymentData: AddPaymentModel = {
        amount: 50,
        email: "testiing@gmail.com"
      };

    const onClick = (): void => {

        console.log("starting payment function");
        
        
        AddPayment(paymentData)
            .then(response => {
                console.log("Succeeded",response.data);
            })
            .catch(error => {
                console.log("Failed ",error);
                
            })

        
    }



	return (
		<div className={styles.userBalanceContainer}>
            <div className={styles.userBalanceLeftContainer}>
                <div className={styles.userBalanceValue}>
                    <p>11 600</p>
                    <RubelIcon/>
                </div>
                <div className={styles.userBalanceReserved}>
                    <p>Зарезервировано:&nbsp;
                        <span>11 600 ₽</span>
                    </p>
                </div>
            </div>
            
                <AddBalance
                  onClick={onClick}
                />
            
		</div>
	);
};

export default UserBalance;
