var abi = {
	bbs: [
		{
		  "inputs": [],
		  "stateMutability": "nonpayable",
		  "type": "constructor"
		},
		{
		  "inputs": [
			{
			  "internalType": "string",
			  "name": "_content",
			  "type": "string"
			}
		  ],
		  "name": "newPost",
		  "outputs": [],
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "inputs": [],
		  "name": "getPosts",
		  "outputs": [
			{
			  "components": [
				{
				  "internalType": "string",
				  "name": "content",
				  "type": "string"
				},
				{
				  "internalType": "uint256",
				  "name": "timestamp",
				  "type": "uint256"
				}
			  ],
			  "internalType": "struct BBS.Post[]",
			  "name": "",
			  "type": "tuple[]"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true
		},
		{
		  "inputs": [
			{
			  "internalType": "uint256",
			  "name": "_id",
			  "type": "uint256"
			}
		  ],
		  "name": "getPost",
		  "outputs": [
			{
			  "components": [
				{
				  "internalType": "string",
				  "name": "content",
				  "type": "string"
				},
				{
				  "internalType": "uint256",
				  "name": "timestamp",
				  "type": "uint256"
				}
			  ],
			  "internalType": "struct BBS.Post",
			  "name": "",
			  "type": "tuple"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true
		}
	  ]
}