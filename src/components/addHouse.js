import React ,{Component} from 'react';
import '../componentsCSS/addHouse.css';
import Web3 from 'web3';
import Sch from '../abis/contracts/Sch.json';
const ipfsClient =require('ipfs-http-client')
const ipfs=new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class addHouse extends Component{
 
    constructor(props){
    super(props);
    console.log(this.props.AbiAndAddress.add);


    
    this.state = {
    buffer:'',
    memHash:''
    };
    this.submit= this.submit.bind(this);
    this.captureFile= this.captureFile.bind(this);
 }
async componentWillMount(){
        await this.loadWeb3()
     
      
}

    async loadWeb3(){
        if(window.ethereum){
          window.web3=new Web3(window.ethereum);
      
         
          await window.ethereum.enable();
        }
        else if(window.web3)
        {
          window.web3=new Web3(window.web3.currentProvider)
        }
        else{
          window.alert('MetaMask not detected');
        }


       
      
      }

    async captureFile(event){
        event.preventDefault();
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('buffer', this.state.buffer)
        }

    }


    async submit(e){
        e.preventDefault();
        
        var name=document.getElementById('houseName').value 
        var pincode=document.getElementById('pinCode').value 
        var address=document.getElementById('address').value 
   
        const filesAdded = await ipfs.add(this.state.buffer)
        console.log(filesAdded)
        var imgHash=filesAdded.cid.string;
        console.log(typeof imgHash);
        
        
        
            if(pincode.length==6)
            {
                 try{
                    pincode=parseInt(pincode);

                    var  currdate=Math.floor(new Date().getTime()/1000);
                   // console.log(currdate);

                    var curraddress=await window.web3.eth.getCoinbase()
                   
                    console.log(curraddress);
                     
                    const networkId = await window.web3.eth.net.getId();

                    const sch = new window.web3.eth.Contract(Sch.abi,Sch.networks[networkId].address);

                    sch.methods.addHouse(name,pincode,address,currdate,imgHash).send({from:curraddress},(err,hash)=>{
                        
                        if(err){
                            alert(err);

                        }
                        else{
                            alert("Sucess !");
                        }

                    })

                 }
                 catch(err){
                  alert(err);

                 }
            }
            else{
                alert("Pincode must be 6 digit number");
            }
      }


    render(){

        return(  
            <div>   
                <div id="topSpace">

                </div>
                <div id="addForm">

                   <form onSubmit={this.submit}> 
                       <fieldset>
                       
                                <label >House Name : </label>
                                
                                <input type="text" id="houseName" placeholder="Enter house name"  required/> <br></br>
                            
                                <label>House PinCode: </label>
                                <input  type="text" id="pinCode"  placeholder="Enter Pincode" required/>  <br></br><br></br>
                                <label>House Address: </label>
                                <textarea id="address"  placeholder="Enter Address" required></textarea> <br></br><br></br>

                                <label>House Image: </label>
                                <input type="file" id="houseImage" accept="image/*" onChange={this.captureFile}></input> <br></br><br></br>
                                <button type="submit" >Add</button>
                       </fieldset>
                        
                    </form>
                    
                </div>
                  

             </div>    
          
        );
            
        
    }
}


export default addHouse;


