let web3, user, bbsInst, posts;
const bbsAddr = "0x94505D4e73393140BB672E914e6D2DbF0CC1177b";

$(document).ready(async () => {
  if(window.ethereum){
    web3 = new Web3(Web3.givenProvider);
    bbsInst = new web3.eth.Contract(abi.bbs, bbsAddr, {from: user});
    posts = await bbsInst.methods.getPosts().call();
    listPosts();
  }else{
    alert("メタマスクをインストールしてください");
  }
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

$(".btn.postBtn").click(async () => {
  var textval = $('#text').val();
  if(textval == "" || !user){
    alert("投稿内容が空白か、ウォレットが接続されていません");
    return;
  }
  try{
    await bbsInst.methods.newPost(textval).send({from:user});
    alert("投稿成功");
  } catch (error){
    alert(error.message);
  }
  location.reload();
})

function listPosts(){
  var div = document.getElementById('posts');
  for (var i = 0; i < posts.length; i++) {
    let dateTime = new Date(posts[i][1] + 1000);
    var parts = 
      '<div class="card">'
          +'<div class="card-body">'
            +'<h6 class="card-subtitle mb-2 text-muted small">'
            + (i+1) +' 名無しさん '+dateTime+'</h6>'
            +'<p class="card-text">'+posts[i][0]+'</p></div></div>';
   div.insertAdjacentHTML('beforeend', parts);
  }
}