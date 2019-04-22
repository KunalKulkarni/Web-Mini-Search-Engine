//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Content extends React.Component {

  /** called with properties:
   *  app: An instance of the overall app.  Note that props.app.ws
   *       will return an instance of the web services wrapper and
   *       props.app.setContentName(name) will set name of document
   *       in content tab to name and switch to content tab.
   *  name:Name of document to be displayed.
   */
  constructor(props) {
    super(props);
    //@TODO
    this.name = this.props.name||'';
    this.state = {name:this.name,content:'',formErrors:[]};
  }

  //@TODO
  componentDidMount(){
    this.getContent();
  }

  componentDidUpdate(prevProps){
    if(this.props.name != prevProps.name){
      this.getContent();
    }
  }

  async getContent(){
  let errors=[];
  try{
    if(this.props.name){
      const result = await this.props.app.ws.getContent(this.props.name);
      this.setState({content:result.content})
    }
  }catch(err){
    errors.push(err.message);
    this.setState({formErorrs:errors});
  }
  }

  render() {
    //@TODO
    const errors = (this.state.formErrors.length)?this.state.formErrors.map((u,i)=><span key={i} className="error">{u}</span>):''
    return (
      <React.Fragment>
        <section>
          <h1>{this.props.name}</h1>
          <pre>{this.state.content}</pre>
        </section>
        {errors}
      </React.Fragment>
    );
  }

}

module.exports = Content;
