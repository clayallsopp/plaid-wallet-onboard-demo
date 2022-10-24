var ethersScript = document.createElement("script");
ethersScript.setAttribute(
  "src",
  "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"
);
document.head.appendChild(ethersScript);

var mintButton = document.getElementById("mint-btn");
var mintProvider;

var onConnect = async function (provider) {
  mintProvider = provider;
  const accounts = await provider.request({ method: "eth_accounts" });

  mintButton.classList.remove("hidden");
  connectButton.classList.add("hidden");

  mintButton.innerHTML = `Mint to ${formatAddress(accounts[0])}`;
};

// via https://github.com/gpxl-dev/truncate-eth-address/blob/main/src/index.ts
var formatAddress = function (address) {
  var truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
  var match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

var onConnect = async function (provider) {
  mintProvider = provider;
  const accounts = await provider.request({ method: "eth_accounts" });

  mintButton.classList.remove("hidden");
  connectButton.classList.add("hidden");

  mintButton.innerHTML = `Mint to ${formatAddress(accounts[0])}`;
};

window.mint = async function () {
  connectButton.setAttribute("disabled", true);
  var contractAddress = "0x6564c29e4d1699aa90457bb2ec2389d461f1c8cd";
  var contractAbi = JSON.stringify([
    {
      inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
      name: "purchase",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "payable",
      type: "function",
    },
  ]);
  var ethersProvider = new window.ethers.providers.Web3Provider(mintProvider);
  var ethersSigner = ethersProvider.getSigner();
  var contractInstance = new window.ethers.Contract(
    contractAddress,
    contractAbi,
    ethersSigner
  );
  try {
    mintButton.innerHTML = "Confirming...";
    const txHash = await contractInstance.purchase(1);
    mintButton.innerHTML = "Minting...";
    console.log({ txHash });
    const tx = await txHash.wait();
    console.log({ tx });
    mintButton.innerHTML = "Minted!";
  } catch (e) {
    console.error(e);
    mintButton.innerHTML = "Mint error";
  }
};
