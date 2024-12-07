import axios from "axios";
import { COIN_GEKO_PRICE } from "./config";

export async function fetchTokenPrice({
    network_id,
    tokenAddress,
}: {
    tokenAddress: string;
    network_id: string;
}) {
    const response = await axios.get(COIN_GEKO_PRICE, {
        params: {
            addresses: tokenAddress,
            network_id,
        },
    });
    return response.data;
}
