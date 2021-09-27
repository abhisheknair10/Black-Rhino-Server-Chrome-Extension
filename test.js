const bitcore = require('bitcore-lib')
const axios = require("axios")

var sendzec = async (recieverAddress, amountToSend) => {
    var sochain_network = "ZEC";
    var privateKey = ""; //Enter Private Key
    var sourceAddress = "t1TXzrc8ujkyQVL5AzmLV1HXhKSpMQaR9Fq";
    let fee = 0.00001;
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
        utxo.zec = Math.floor(Number(element.value));
        utxo.script = element.script_hex;
        utxo.address = utxos.data.data.address;
        utxo.txId = element.txid;
        utxo.outputIndex = element.output_no;
        totalAmountAvailable += utxo.zec;
        inputCount += 1;
        inputs.push(utxo);
    });

    if((totalAmountAvailable - fee) >= 0){
        //Set transaction input
        transaction.from(inputs);
    
        // set the recieving address and the amount to send
        transaction.to(recieverAddress, amountToSend-fee);
    
        // Set change address - Address to receive the left over funds after transfer
        transaction.change(sourceAddress);

        // Set fees
        transaction.fee(fee);
    
        // Sign transaction with your private key
        transaction.sign(privateKey);
    
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
        return result.data.data;
    }
};

console.log(sendzec("", 0.1))

//--------------------------------------------------------------------

const axios = require("axios")

var sendBitcoin = async (recieverAddress, amountToSend) => {
    var sochain_network = "ZEC"
    sourceAddress = "t1TXzrc8ujkyQVL5AzmLV1HXhKSpMQaR9Fq"
    var utxos = await axios.get(
        `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
    );
    console.log(utxos.data.data.txs)
}

sendBitcoin("", "")