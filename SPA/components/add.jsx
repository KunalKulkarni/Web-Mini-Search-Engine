//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Add extends React.Component {

  /** called with properties:
   *  app: An instance of the overall app.  Note that props.app.ws
   *       will return an instance of the web services wrapper and
   *       props.app.setContentName(name) will set name of document
   *       in content tab to name and switch to content tab.
   */
  constructor(props) {
    super(props);
    //@TODO
    this.handleChange = this.handleChange.bind(this);
    this.state = {formErrors:[]};
  }

  //@TODO add code

  //Note that a you can get information on the file being uploaded by
  //hooking the change event on <input type="file">.  It will have
  //event.target.files[0] set to an object containing information
  //corresponding to the uploaded file.  You can get the contents
  //of the file by calling the provided readFile() function passing
  //this object as the argument.

  async handleChange(event){
    let errors=[];
    const target =  event.target;
    const file = target.files[0];
    try{
      const content = await readFile(file);
      const name  = file.name.split(".")[0];
   
      await this.props.app.ws.addContent(name,content);
      this.props.app.setContentName(name);
    }
    catch(err){
    errors.push(err.message);
      this.setState({formErrors:errors});
    }
  }

  render() {
    //@TODO
    const errors = (this.state.formErrors.length)?this.state.formErrors.map((u,i)=><span key={i} className="error">{u}</span>):'';
    return (
    <React.Fragment>
    <form>
      <label className="label">Choose File:
        <input className="control" type="file" onChange={this.handleChange}/>
      </label>  
    </form>
    {errors}
    </React.Fragment>
    );
  }

}

module.exports = Add;

/** Return contents of file (of type File) read from user's computer.
 *  The file argument is a file object corresponding to a <input
 *  type="file"/>
 */
async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>  resolve(reader.result);
    reader.readAsText(file);
  });
}
