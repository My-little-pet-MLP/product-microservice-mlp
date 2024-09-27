import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { OrderRepository } from "../../repository/order-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface ListAllByOrderIdServiceRequest{
    orderId:string;
}
interface ListAllByOrderIdServiceResponse {
    productsInOrders :ProductInOrders[]|null;
    error: Error|null;
}

export class ListAllProductsInOrdersByOrderId{
    constructor(private productInOrdersRepository:ProductInOrderRepository, private orderRepository:OrderRepository){}

    async execute({orderId}:ListAllByOrderIdServiceRequest):Promise<ListAllByOrderIdServiceResponse>{
        const storeExists = await this.orderRepository.getById(orderId);
        if(!storeExists){
            return {productsInOrders:null,error: new StoreNotFoundError}
        }
        const productsInOrders = await this.productInOrdersRepository.listAllByOrder(orderId);
        return {productsInOrders,error:null}
    }
}