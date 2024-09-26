import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { ProductInOrdersNotFoundError } from "../error/product-in-orders-not-found-error";

interface GetProductInOrderByIdServiceRequest{
    id:string;
}
interface GetProductInOrderByIdServiceResponse{
    productInOrder:ProductInOrders |null;
    error: Error |null;
}

export class GetProductInOrderByIdService{
    constructor(private ProductInOrdersRepository:ProductInOrderRepository){}

    async execute({id}:GetProductInOrderByIdServiceRequest):Promise<GetProductInOrderByIdServiceResponse>{
    
        const productInOrder = await this.ProductInOrdersRepository.findById(id);
        if(!productInOrder){
            return{productInOrder:null,error:new ProductInOrdersNotFoundError}
        }
        return{productInOrder,error:null};
    }
}