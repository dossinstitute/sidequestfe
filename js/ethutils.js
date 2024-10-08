async function connectWalletByProvider(provider) {
    console.log("connectWalletByProvider called");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Connected to wallet");
    return signer;
}

async function fetchContractABI(filePath) {
    console.log(`fetchContractABI called with params: filePath=${filePath}`);
    const response = await fetch(filePath);
    const data = await response.json();
    return data.abi;
}

async function initializeContract(provider, abiPath, contractAddress) {
    console.log(`initializeContract called with params: provider, abiPath=${abiPath}, contractAddress=${contractAddress}`);
    const signer = await connectWalletByProvider(provider);
    const contractABI = await fetchContractABI(abiPath);
    return new ethers.Contract(contractAddress, contractABI, signer);
}

async function parseLogs(logs, contract) {
    console.log(`parseLogs called with params: logs=${JSON.stringify(logs)}, contract=${contract.address}`);

    // Get the ABI from the contract interface
    const abi = contract.interface.format(ethers.utils.FormatTypes.json);

    // Debugging: log the ABI
    console.log("Contract ABI:", abi);

    // Ensure the ABI is an array
    if (!Array.isArray(JSON.parse(abi))) {
        throw new Error("ABI is not an array");
    }

    const iface = new ethers.utils.Interface(abi);
    const events = [];

    for (const log of logs) {
        try {
            const parsedLog = iface.parseLog(log);
            events.push(parsedLog);
        } catch (error) {
            console.error(`Error parsing log: ${error.message}`, error);
        }
    }

    return events;
}

async function decodeRevertReason(transactionHash, provider) {
    console.log(`decodeRevertReason called with params: transactionHash=${transactionHash}`);
    const tx = await provider.getTransaction(transactionHash);
    if (!tx) {
        console.error("Transaction not found");
        return "Transaction not found";
    }
    
    try {
        const code = await provider.call(tx, tx.blockNumber);
        if (code === "0x") {
            console.error("No revert reason provided in the transaction");
            return "No revert reason provided";
        }
        const reason = ethers.utils.toUtf8String('0x' + code.substr(138));
        return reason.replace('VM Exception while processing transaction: revert ', '');
    } catch (error) {
        console.error("Error decoding revert reason:", error);
        return `Error decoding revert reason: ${error.message}`;
    }
}

function handleError(error) {
    console.log(`handleError called with params: ${error}`);
    console.error("Error:", error);
    if (error.data && error.data.message) {
        let errorMessage = error.data.message;
        // Remove "VM Exception while processing transaction: revert " from the error message
        errorMessage = errorMessage.replace("VM Exception while processing transaction: revert ", "");
        document.getElementById('output').innerText = `Error: ${errorMessage}`;
    } else {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
}

function parseQuestData(questStatus) {
    console.log(`parseQuestData called with params: questStatus=${JSON.stringify(questStatus)}`);
    return {
        questId: questStatus[0].toString(),
        data: questStatus[1],
        isInitialized: questStatus[2],
        isActive: questStatus[3],
        isCompleted: questStatus[4],
        initiator: questStatus[5],
        expirationTime: questStatus[6].toString(),
        questContract: questStatus[7]
    };
}

function verifyFunctionSignature(contract, functionName, params) {
    console.log(`verifyFunctionSignature called with params: contract=${contract.address}, functionName=${functionName}, params=${JSON.stringify(params)}`);
    const functionFragment = contract.interface.getFunction(functionName);
    const encodedParams = contract.interface.encodeFunctionData(functionFragment, params);
    const decodedParams = contract.interface.decodeFunctionData(functionFragment, encodedParams);

    const isMatch = JSON.stringify(params) === JSON.stringify(decodedParams);

    if (!isMatch) {
        console.error(`Function signature verification failed for ${functionName} with params: ${JSON.stringify(params)}`);
        console.error(`Expected params: ${JSON.stringify(decodedParams)}`);
        console.error(`Valid functions: ${contract.interface.fragments.map(frag => `${frag.name}: ${JSON.stringify(frag.inputs)}`)}`);
    }

    return isMatch;
}
