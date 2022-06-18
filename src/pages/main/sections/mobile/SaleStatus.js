import {useSelector} from "react-redux";
import ImageBox from "../../../../components/ImageBox";
import { useWallet } from "../../../../context/wallet";
import { getGeneral } from "../../../../redux/nft";

export default function SaleStatus() {
  const wallet = useWallet();
  const nftState = useSelector(getGeneral);
  const imgName = nftState.isWhitelist ? "wl-sale-live.webp" : "public-sale-live.webp";
  return wallet.account ? (
    <ImageBox
      image={`url(images/mobile/${imgName})`}
      width="70%"
      height="50%"
      mt={2}
    />
  ) : (
    <></>
  );
}
