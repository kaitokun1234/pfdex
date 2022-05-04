let web3, user, dexInst, tokenInst, priceData;
let token = undefined;
let buyMode = true;
const dexAddr = "0x64a93fd42242Fc4628cb29A889Fc06DE829B8791";
const tokens = {DAI:"0x6eaB53b4E73eF514b2F79b25b51c3e26Bb2EAeD5",
                LINK: "0x724d22D524885901743086a528b2e5968Ba1C2E9",
                COMP:"0x31041030E5575F7AB9744991464B0731B3273510"}

$(document).ready(async () => {
  if(window.ethereum){
    web3 = new Web3(Web3.givenProvider);
    dexInst = new web3.eth.Contract(abi.dex, dexAddr, {from: user});
  }else{
    alert("メタマスクをインストールしてください");
  }

  priceData = await getPrice();
});

$(".btn.login").click(async () => {
  try{
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      user = accounts[0];
      $(".btn.login").html(user.slice(0,3)+"…"+user.slice(-3));
      token != undefined ? enableSwap() : $('.btn.swap').html('select token');
  } catch (error){
    alert(error.message);
  }
})

$(function(){
  $('.dropdown-item').click(function(){
    token = $(this).attr('value');
    token = token.replace(/\s/g, "");
    let visibleItem = $('.dropdown-trigger', $(this).closest('.dropdown'));
    visibleItem.text(token);
    if(user){
      tokenInst = new web3.eth.Contract(abi.token, tokens[token], {from : user});
      enableSwap();
    }
    updateOutput($('.form-control.input').val());
  });
});


$(".btn.allow").click(async () => {
 changeMode();
})

$(".form-control.input").on("input", function(){
  if(token == undefined){
    alert("please select token");
    return;
  }
  let input = $(this).val();
  if(input != 0){
    updateOutput(input);
  }
})

$(".btn.swap").click(async() => {
  try{
    if($('.form-control.input').val() == 0){
      throw new Error('エラー：金額が0です');
    }
    buyMode ? await buyToken() : await sellToken()
  }catch (err){
    alert(err.message);
  }
})

function buyToken(){
  const tokenAddr = tokenInst._address;
  let finalinput = web3.utils.toWei($('.form-control.input').val(), 'ether');
  let finaloutput = web3.utils.toWei($('.form-control.output').val(), 'ether');
  return new Promise((resolve, reject) => {
      dexInst.methods
      .buyToken(tokenAddr, finalinput, finaloutput)
      .send({ value: finalinput, from: user })
      .then((receipt) => {
          const eventData = receipt.events.buy.returnValues;
          const amountDisplay = parseFloat(web3.utils.fromWei(eventData._amount, "ether"));
          const costDisplay = parseFloat(web3.utils.fromWei(eventData._cost, "ether"));
          const tokenAddr = eventData._tokenAddr;
          alert(`
          Swap successful! \n
          Token address: ${tokenAddr} \n
          Amount: ${amountDisplay.toFixed(7)} ${token} \n
          Cost: ${costDisplay.toFixed(7)} ETH
          `);
          resolve();})
      .catch((err) => reject(err));
});
}

async function sellToken(){
  let finalInput = web3.utils.toWei($('.form-control.input').val(), 'ether');
  let finalOutput = web3.utils.toWei($('.form-control.output').val(), 'ether');

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
    .sellToken(tokenAddr, finalOutput, finalInput)
    .send({from: user});
    const eventData = sellTx.events.sell.returnValues;
          const amountDisplay = parseFloat(web3.utils.fromWei(eventData._amount, "ether"));
          const costDisplay = parseFloat(web3.utils.fromWei(eventData._cost, "ether"));
          const _tokenAddr = eventData._tokenAddr;
          alert(`
          Swap successful! \n
          Token address: ${_tokenAddr} \n
          Amount: ${amountDisplay.toFixed(7)} ${token} \n
          Cost: ${costDisplay.toFixed(7)} ETH
          `);
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
  const priceDatas = { DAI: priceData.daiEth,
                LINK: priceData.linkEth,
                COMP:priceData.compEth };
  output = input / priceDatas[token];
                //output = buyMode ? input / priceDatas[token] : input * priceDatas[token];
  let exchangeRate = output / input;
  $(".form-control.output").val(output);
}

function enableSwap(){
  $('.btn.swap').html('swap');
  let swapbtn = document.getElementById('swap');
  swapbtn.disabled = false;
}

function changeMode(){
  buyMode = !buyMode;
  let up = buyMode ? $('.row.input'): $('.row.output');
  let down = buyMode ? $('.row.output'): $('.row.input');
  
  up.insertBefore('.btn.allow');
  down.insertAfter('.btn.allow');
}

$('.dropdown-trigger').dropdown();
