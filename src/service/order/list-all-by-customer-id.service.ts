import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";

interface ListAllByCustomerIdServiceRequest {
    customerId: string;
    page:number;
    size:number;
}
interface ListAllByCustomerIdServiceResponse {
    orders: Order[] | null;
    error: Error | null;
}

export class ListALLByCustomerIdService{
    constructor(private orderRepository:OrderRepository){}
    async execute({customerId,page,size}:ListAllByCustomerIdServiceRequest):Promise<ListAllByCustomerIdServiceResponse>{
        const UserClearkExists = await clearkClientCustomer.users.getUser(customerId)
        if(!UserClearkExists){
            return {orders:null,error:new CustomerNotFoundError}
        }
        const orders = await this.orderRepository.listAllByCustomerId(customerId,page,size);
        return {orders,error:null}
    }

}