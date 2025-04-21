import { TOrder, TOrderStatus } from './order.interface';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { Listing } from '../listing/listing.model';
import { Order } from './order.model';
import { orderUitls } from './order.utils';

const createOrderIntoDB = async (payload: TOrder, client_ip: string) => {

  const { buyerId, sellerId, product } = payload;


  const buyer = await User.findById(buyerId);
  const seller = await User.findById(sellerId);

  if (!buyer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Buyer not found.');
  }
  if (!seller) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Seller not found.');
  }

  if (buyerId === sellerId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You can not order your own product.',
    );
  }

  const isProductExist = await Listing.findOne({
    _id: product?.id,
    isDeleted: false,
  });

  if (!isProductExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found.');
  }

  const orderedProduct = await Order.create(payload);
  Order.create(payload);

  // payment integration
  const shurjopayPayload = {
    amount: isProductExist.price,
    order_id: buyer?._id,
    currency: 'BDT',
    customer_name: buyer?.name,
    customer_address: 'N/A',
    customer_email: buyer?.email,
    customer_phone: 'N/A',
    customer_city: 'N/A',
    client_ip,
  };

  const payment = await orderUitls.makePaymentAsync(shurjopayPayload);
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
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        'transaction.payment_status': verifiedPayment[0].bank_status,
        status:
          verifiedPayment[0]?.bank_status === 'Success'
            ? 'completed'
            : 'pending',
      },
    );
  }

  return verifiedPayment;
};

const getSalesOfUserFromDB = async (userId: string) => {
  const result = await Order.find({ userId })
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
  const result = await Order.find({ userId })
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
    newStatus: { status: TOrderStatus }
  ) => {
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      throw new AppError(StatusCodes.NOT_FOUND, 'No order found with the given ID.');
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
  updateOrderStatus
};
