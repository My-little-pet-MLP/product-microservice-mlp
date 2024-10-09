import { Order } from "@prisma/client"
import { OrderRepository } from "../../repository/order-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";

interface VerifyCustomerHavePedingOrderServiceRequest{
    customerId: string
    storeId:string
}
interface VerifyCustomerHavePedingOrderServiceResponse{
    order:Order|null;
    error:Error|null;
}
export class VerifyCustomerHavePedingOrderService{
    constructor(private orderRepository:OrderRepository){}

    async execute({customerId,storeId}:VerifyCustomerHavePedingOrderServiceRequest):Promise<VerifyCustomerHavePedingOrderServiceResponse>{
        const order = await this.orderRepository.verifyCustomerHavePedingOrder(customerId,storeId);

        if(!order){
            return {order:null,error: new OrderNotFoundError}
        }
        
        return {order,error:null}
    }
}