const CryptoAccount = require("send-crypto");


const withdraw = async (recieverAddress, amountToSend) => {
    /* Load account from private key */
    const privateKey = "beaa9540abe34f4b97c751d1283d66a86073bd9b460365a07b0aaa3e259a840b";
    const account = new CryptoAccount(privateKey);
    //t1MDPgTFbgS5TyRsJjFVh3c7JHAUJv5iwJZ

    //console.log(await account.address("ZEC"));
    //console.log(await account.getBalance("ZEC"));

    await account.send(
        "t1MRwrY7TBF692A33V5NF3dtkQEc1DEAsgt", 
        0.00431605, 
        "ZEC", 
        {subtractFee: true}
    ).on("transactionHash", console.log).on("confirmation", console.log);
};

withdraw("t1MRwrY7TBF692A33V5NF3dtkQEc1DEAsgt", );