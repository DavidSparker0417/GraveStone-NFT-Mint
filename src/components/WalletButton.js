import {Button} from "@mui/material"
import { useEffect, useState } from "react";
import { useWallet } from "../context/wallet";
import { dsWalletTrimedAccount } from "../ds-lib/ds-web3";

export default function WalletButton() {
  const wallet = useWallet();
  const [name, setName] = useState();

  useEffect(() => {
    if (!wallet.account)
    {
      setName("Connect Wallet");
      return;
    }
    const trimedAccount = dsWalletTrimedAccount(wallet.account);
    setName(trimedAccount);
  }, [wallet.account]);

  function handleClick() {
    if (wallet.account)
    wallet.disconnect();
    else 
      wallet.connect();
  }

  return (
    <Button 
      variant="contained"
      onClick={handleClick}
      color="warning"
    >
      {name}
    </Button>
  );
}