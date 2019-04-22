//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Search extends React.Component {

  /** called with properties:
   *  app: An instance of the overall app.  Note that props.app.ws
   *       will return an instance of the web services wrapper and
   *       props.app.setContentName(name) will set name of document
   *       in content tab to name and switch to content tab.
   */
  constructor(props) {
    super(props);
    //@TODO
    //console.log(props.values);
    
    this.result={};
    this.displayResult ='';
    this.state = { display:false,displayResult:'',values: '', formErrors: []};
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  //@TODO
  

  onChange(event) {
    const target = event.target;

    const name = target.name;
    const value = target.value || '';

    this.setState({values: value});
  }
  
  async onSubmit(event){
      event.preventDefault();
      
      await this.commonSubmission(event);
  }
  async onBlur(event){
    event.preventDefault();
    await this.commonSubmission(event);
  }
  changeTab(event){
    event.preventDefault();
    const href = event.target.getAttribute('href');
    this.props.app.setContentName(href)
    
  }

 async commonSubmission(event){
    let errors =[];
    const target = event.target;
    const name = target.name;
    const value = target.value || this.state.values ||'';
    try{
      if (!value) throw{message:"Field is Required"};
      this.result = await this.props.app.ws.searchDocs(value);
      //console.log(this.result)
      if(this.result.totalCount===0){
        if(value)
          errors.push("No Results found for "+ value);
        this.setState({display: false,formErrors:errors});
      }else{
        this.setState({display: true,displayResult:this.searchResults()});
      }
    }
    catch(err){
        //console.log(err.message)
        errors.push(err.message);
        this.setState({display: false,formErrors:errors});
    }

  }

  searchResults(){
    const obj = this.result.results.map((u,i)=> 
    <div key ={i} className="result">
      <a className="result-name" onClick={this.changeTab} href={u.name}>{u.name}</a>
      <br/>
      <p> { this.highlighter(u.lines,this.state.values)}<br/></p>
    </div>
    );
    return(obj);
   
  }

  highlighter(lines,queries){
  let ar='';
    for(let l of lines){
      const arr = l.match(/\w+|\s+|[^\s\w]+/g);
      const q = queries.split(" ");
      ar = arr.map((cv,ci)=> ((this.searchWord(cv,q))? <span key={ci} className="search-term">{cv}</span> : cv )); 
    }
    return ar;
  }

  searchWord(u,query){
  for(let q of query){
        //console.log(u +" and query "+q)
        if(q.localeCompare(u.toLowerCase().replace(/[^a-z]/g,'')) === 0)
         return true;
      }
      return false;
  }
  render() {
    //@TODO
    const displayResult= (this.state.display)?this.state.displayResult:'';
    const errors = (!this.state.display)?this.state.formErrors.map((u,i)=><span key={i} className="error">{u}</span>):'';
    return (
    <React.Fragment>
    <form onSubmit={this.onSubmit}>
        <label>
          <span className="label">Search Terms:</span>
          <span className="control">
            <input name="q" id="q" value={this.state.values.value} onChange={this.onChange} onBlur={this.onBlur}/>
          </span>
        </label>
      </form>
      <div>
      {displayResult}
      </div>
      {errors}
</React.Fragment>
    );
  }

}

module.exports = Search;
