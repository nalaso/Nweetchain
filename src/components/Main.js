import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  handleKeyDown(e) {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight+10}px`; 
    // In case you have a limitation
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto mt-5" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <div class="newnweetinput">
                <h2 className='newnweettitle'>What's in your mind?...</h2>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const description = this.imageDescription.value
                  this.props.uploadNweet(description)
                }} >
                  <div className="form-group">
                    <br></br>
                      <textarea
                        onKeyDown={this.handleKeyDown} 
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="Describe it..."
                        required />
                  </div>
                  <div class="wrapper">
                    <div class="file-upload">
                    <img src="https://img.icons8.com/fluency/30/000000/attach.png"/>
                      <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg">Nweet!</button>
                  </div>
                </form>
              </div>
              <p>&nbsp;</p>
              { this.props.nweets.map((nweet, key) => {
                return(
                  <div style={{borderColor:'grey',borderWidth:'1px',borderRadius:5}} className="card mb-4 bg-dark" key={key} >
                    <div className="card-header">
                      <img
                      
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(nweet.author, 30).toString()}`}
                      />
                      <small className="texts">{nweet.author}</small>
                    </div>
                    <ul id="imageList" className="bgtweet list-group list-group-flush" style={{borderBottomLeftRadius:5,borderBottomRightRadius:5}}>
                      <li className="list-group-item bgtweet" style={{padding:'50px'}}>
                        <h5>{nweet.nweetdescription}</h5>
                      </li>
                      {
                        nweet.hash != "none" && (
                          <li className="list-group-item">
                            <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${nweet.hash}`} style={{ maxWidth: '150px'}}/></p>
                          </li>
                        )
                      }
                      <li key={key} style={{borderTopWidth:'1px',borderTopColor:'grey',borderBottomLeftRadius:5,borderBottomRightRadius:5}} className="bgtweet list-group-item py-2">
                        <small className="float-left mt-1">
                          <a className='text-muted'>TIPS RECEIVED: </a> <span>{window.web3.utils.fromWei(nweet.tipAmount.toString(), 'Ether')}</span> ETH
                        </small>
                        <button
                          className="btn btn-sm float-right"
                          style={{backgroundColor:"aliceblue",fontWeight:"bold",color:"#005cb0"}}
                          name={nweet.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.0001', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipNweetOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.0001 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;