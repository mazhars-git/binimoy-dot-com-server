import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';
const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp.sp_endpoint!,
  config.sp.sp_username!,
  config.sp.sp_password!,
  config.sp.sp_prefix!,
  config.sp.sp_return_url!,
);

const makePaymentAsync = async (
  paymentPayload: any,
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });
};

const verifiedPaymentAsync = async (
  order_id: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response_data) => resolve(response_data),
      (error) => reject(error),
    );
  });
};
export const orderUitls = {
  makePaymentAsync,
  verifiedPaymentAsync,
};
