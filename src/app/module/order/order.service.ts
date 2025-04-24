import { TOrder, TOrderStatus } from './order.interface';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { Listing } from '../listing/listing.model';
import { Order } from './order.model';
import { orderUitls } from './order.utils';
import { JwtPayload } from 'jsonwebtoken';

const createOrderIntoDB = async (
  userData: JwtPayload,
  orderData: TOrder,
) => {
  const user = await User.findOne({email:userData?.email});
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user not found!');
  }

  const product = await Listing.findById(orderData?.product)

  
  const isProductExist = await Listing.findOne({
    _id: product?._id,
    isDeleted: false,
  });

  if (!isProductExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found!');
  }



  if (user?._id.toString() === product?.userID.toString()) {
    throw new AppError(StatusCodes.CONFLICT, 'you can not buy your own product');
  }

 


  const isOrderCompleted = await Order.findOne({
    product: product?._id,
    status: 'completed',
  });

  if (isOrderCompleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Order are alrady sold .',
    );
  }

  const modifyData ={
    buyerId:user?._id,
    sellerId:product?.userID,
    product: product?._id,
    address: orderData?.address
  };

  const orderedProduct = await Order.create(modifyData);


  // payment integration
  const paymentPaylod = {
    amount: product?.price,
    order_id: orderedProduct?._id,
    currency: 'BDT',
    customer_name: user?.name,
    customer_address: orderData?.address,
    customer_phone: user?.phoneNumber,
    customer_email: user?.email,
    customer_city:"city",
    client_ip:"",
  };

  const payment = await orderUitls.makePaymentAsync(paymentPaylod);
  if(!payment){
    throw new AppError(StatusCodes.BAD_REQUEST, 'payment failed!');
  }
  if (payment.transactionStatus) {
    await Order.findByIdAndUpdate(orderedProduct?._id, {
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,

      },
    });
  }
  return payment.checkout_url;
};


const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUitls.verifiedPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        $set: {
          'transaction.bank_status':
            verifiedPayment[0].bank_status,
          'transaction.sp_code': verifiedPayment[0].sp_code,
          'transaction.sp_message':
            verifiedPayment[0].sp_message,
          'transaction.transactionStatus':
            verifiedPayment[0].transaction_status,
          'transaction.method': verifiedPayment[0].method,
          'transaction.date_time': verifiedPayment[0].date_time,
          'paymentStatus':
            verifiedPayment[0].bank_status === 'Success'
              ? 'paid'
              : verifiedPayment[0].bank_status === 'Failed'
                ? 'pending'
                : verifiedPayment[0].bank_status === 'Cancel'
                  ? 'cancelled'
                  : '',
          'orderInvoice': verifiedPayment[0].order_id,
        },
      },
      { new: true },
    );
  }

  return verifiedPayment;
};



const getSalesOfUserFromDB = async (userId: string) => {
  const result = await Order.find({sellerId:userId })
    .select('buyerId sellerId product status transaction')
    .populate({
      path: 'buyerId sellerId',
      select: 'name email phoneNumber role isBlocked',
    })
    .populate({
      path: 'product',
      select:
        'title userID condition brand price category images description status location isDeleted',
    });

  return result;
};

const getPurchaseOfUserFromDB = async (userId: string) => {
  const result = await Order.find({buyerId: userId })
    .select('buyerId sellerId product status transaction')
    .populate({
      path: 'buyerId sellerId',
      select: 'name email phoneNumber role isBlocked',
    })
    .populate({
      path: 'product',
      select:
        'title userID condition brand price category images description status location isDeleted',
    });

  return result;
};

const updateOrderStatus = async (
  orderId: string,
  newStatus: { status: TOrderStatus },
) => {
  const existingOrder = await Order.findById(orderId);
  if (!existingOrder) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'No order found with the given ID.',
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, newStatus, {
    new: true,
  });

  return updatedOrder;
};

export const OrderService = {
  createOrderIntoDB,
  verifyPayment,
  getSalesOfUserFromDB,
  getPurchaseOfUserFromDB,
  updateOrderStatus,
};
