import axios from "axios";
import { COIN_GEKO_PRICE } from "./config";

export async function fetchTokenPrice({
  tokenAddress,
}: {
  tokenAddress: string;
}) {
  const response = await axios.get(`${COIN_GEKO_PRICE}/ethereum`, {
    params: {
      contract_addresses: tokenAddress,
      vs_currencies: "usd",
      "x-cg-demo-api-key": `${process.env.COIN_GECKO_API_KEY}`,
    },
    headers: {
      "x-cg-demo-api-key": `${process.env.COIN_GECKO_API_KEY}`,
    },
  });
  return response.data;
}
