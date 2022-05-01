let web3, user, dexInst, tokenInst, priceData;
let token = undefined;
let buyMode = true;
const dexAddr = "0x9bAF905a932B266d2FD5be65599533c92f2Ec00E";
const tokens = {DAI:"0x56b63755e5eba8a5066b3cB2cC66792e69819fD6",
                LINK: "0x72b9B4a9331FbFdACf2508013d57943F426f86A8",
                COMP:"0x7EBEf108Ac183BC548a1d681a5dc1728F1E96C9f"}

$(document).ready(async () => {
  if(window.ethereum){
    web3 = new Web3(Web3.givenProvider);
    dexInst = new web3.eth.Contract(abi.dex, dexAddr, {from: user});
  }else{
    alert("メタマスクをインストールしてください");
  }

  priceData = await getPrice();
  console.dir(priceData);
});

$(".btn.login").click(async () => {
  try{
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      user = accounts[0];
      $(".btn.login").html(user.slice(0,3)+"…"+user.slice(-3));
  } catch (error){
    alert(error.message);
  }
})

$(function(){
  $('.dropdown-menu .dropdown-item').click(function(){
    token = $(this).attr('value');
    let visibleItem = $('.dropdown-toggle', $(this).closest('.dropdown'));
    visibleItem.text(token);
    if(user){
      tokenInst = new web3.eth.Contract(abi.token, tokens[token], {from : user});
    }
  });
});


$(".btn.allow").click(async () => {
  let allowtxt;
  if(buyMode){
    buyMode=false;
    allowtxt="↑";
  } else {
    buyMode=true;
    allowtxt = "↓";
  }
  $(".btn.allow").html(allowtxt);
})

$(".input").on("input", function(){
  if(token == undefined){
    return;
  }
  const input = parseFloat($(this).val());
  updateOutput(input);
})

$(".btn.swap").click(async() => {
  try{
    buyMode ? await buyToken() : await sellToken()
  }catch (err){
    alert(err.message);
  }
})

function buyToken(){
  const tokenAddr = tokenInst._address;
  let finalinput = web3.utils.toWei($('.input').val(), 'ether');
  let finaloutput = web3.utils.toWei($('.output').val(), 'ether');
  console.log(tokenAddr, finalinput, finaloutput);
  return new Promise((resolve, reject) => {
      dexInst.methods
      .buyToken(tokenAddr, finalinput, finaloutput)
      .send({ value: finalinput, from: user })
      .then((receipt) => {
          console.log(receipt);
          resolve();})
      .catch((err) => reject(err));
});
}

async function sellToken(){
  let finalInput = web3.utils.toWei($('.input').val(), 'ether');
  let finalOutput = web3.utils.toWei($('.output').val(), 'ether');

  const allowance =await tokenInst.methods.allowance(user, dexAddr).call();
  if(parseInt(finalInput) > parseInt(allowance)){
    try{
      await tokenInst.methods.approve(dexAddr, finalInput).send();
    } catch(err){
      throw(err);
    }
  }

  try{
    const tokenAddr = tokenInst._address;
    const sellTx = await dexInst.methods
    .sellToken(tokenAddr, finalInput, finalOutput)
    .send({from: user});
    console.log(sellTx);
  }catch (err){
    throw (err);
  }
}

async function getPrice(){
  const daiData = await (await fetch("https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=eth")).json();
  const compData = await (await fetch("https://api.coingecko.com/api/v3/simple/price?ids=compound-governance-token&vs_currencies=eth")).json();
  const linkData = await (await fetch("https://api.coingecko.com/api/v3/simple/price?ids=link&vs_currencies=eth")).json();

  return {
    daiEth: daiData.dai.eth,
    linkEth: linkData.link.eth,
    compEth: compData["compound-governance-token"].eth
  }
}

function updateOutput(input){
  let output;
  switch(token){
    case "COMP":
      output = buyMode ? input / priceData.compEth : input * priceData.compEth;
      break;
    case "LINK":
      output = buyMode ? input / priceData.daiEth : input * priceData.compEth;
      break;
    case "DAI":
      output = buyMode ? input / priceData.linkEth : input * priceData.compEth;
      break;
  }
  const exchangeRate = output / input;
  $(".output").val(output);
}