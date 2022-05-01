let web3, user, dexInst, tokenInst, priceData;
let buyMode = true;
const dexAddr = "0x31cDB5c58805C7Aa770ec49cCbEf5aa17862FC5e";
const tokens = {JPYC:"0x6424D9F2d66e9173f1242526fE1efab9DB114279",
                BNB: "0x0E51c5FA48837b4622a610cF3a2dbaf5b1624a0D",
                USDT:"0xbf96F52975DA5cBbD609e3Ab331Ab64bd50C414F"}

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
  } catch (error){
    alert(error.message);
  }
})

$(function(){
  $('.dropdown-menu .dropdown-item').click(function(){
    let token = $(this).attr('value');
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
  
}