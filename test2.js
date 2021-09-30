const bitcore = require('bitcore-lib')
const axios = require("axios")

var sendzec = async (recieverAddress, amountToSend) => {
    var sochain_network = "ZEC";
    var privateKey = "KyodbZ4GCAVNJhjmmxiD76Rmfi2GBxWVrGKZZxRcg6KTtvK5t9U4"; //Enter Private Key
    var sourceAddress = "t1MRwrY7TBF692A33V5NF3dtkQEc1DEAsgt";
    let fee = 0.0001;
    let inputCount = 0;
    let outputCount = 2;

    var utxos = await axios.get(
        `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
    );

    var transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;
  
    let inputs = [];
    utxos.data.data.txs.forEach(async (element) => {
        let utxo = {};

        utxo.txId = element.txid;
        utxo.output_no = element.output_no;
        utxo.script_asm = element.script_asm;
        utxo.script_hex = element.script_hex;
        utxo.value = parseFloat(element.value).toFixed(5);
        //utxo.address = utxos.data.data.address;
        utxo.confirmations = element.confirmations;
        
        totalAmountAvailable += utxo.value;
        inputCount += 1;
        inputs.push(utxo);
    });

    console.log(inputs)
    console.log(totalAmountAvailable)
    console.log(totalAmountAvailable - fee)

    if((totalAmountAvailable - amountToSend - fee) >= 0){
        //Set transaction input
        console.log("Inputs")
        transaction.from(inputs);
        console.log("Inputs")
    
        // set the recieving address and the amount to send
        transaction.to(recieverAddress, amountToSend - fee);
        console.log("Set Recieving Address and Amount to Send")
    
        // Set change address - Address to receive the left over funds after transfer
        transaction.change(sourceAddress);
        console.log("Source Address")

        // Set fees
        transaction.fee(fee);
    
        // Sign transaction with your private key
        transaction.sign(privateKey);
        console.log("Signed")
    
        // serialize Transactions
        var serializedTransaction = transaction.serialize();
        // Send transaction
        var result = await axios({
            method: "POST",
            url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
            data: {
                tx_hex: serializedTransaction,
            },
        });
        console.log(result.data.data)
        console.log("Sending Money...")
        return result.data.data;
    }
    else{
        console.log("Low Funds")
    }
};

var transaction = sendzec("t1Unz8V36EZ8cLfs7AuHEHjpxACzDBAygE5", 0.002);