(function () {
  //'use strict';
  console.log("RRRR", C);

  C.RunningClock = React.createClass({
    getInitialState: function() {
      return {splits: []};
    },

    componentDidMount: function() {
    },

    onSplit: function(m) {
      var split = {t: m, idx: this.state.splits.length};
      this.setState(this.state.splits.splice(0, 0, split));
    },

    render: function() {
      return (
        <div className="container-fluid">
          <SplitButton tickInterval={this.props.tickInterval} splitHandler={this}/>
          <SplitList splits={this.state.splits} />
        </div>
      );
    }
  });

  var SplitButton = React.createClass({
    getInitialState: function() {
      return {currentTime: moment()};
    },

    onTick: function() {
      this.setState({currentTime: moment()});
    },

    componentDidMount: function() {
      this.onTick();
      setInterval(this.onTick, this.props.tickInterval);
    },

    onClick: function(e) {
      console.log("Click: ", e);
      this.props.splitHandler.onSplit(moment());
    },

    render: function() {
      return (
        <div className="row">
          <div className="col-lg-12 split-button" onClick={this.onClick}>
             <div>{this.state.currentTime.format("HH:mm:ss")} </div>
          </div>
        </div>        
      );
    }
  });

  var SplitList = React.createClass({
    getInitialState: function() {
      return {selectedSplit: null};
    },

    onClickInBib: function(e) {
      console.log("Bib: ", e);
    },

    /** Make sure we focus on the input box when editing a bib name */
    componentDidUpdate: function() {
      if (this.state.selectedSplit) {
        React.findDOMNode(this.refs.selectedBibField).focus();
      }
    },  

    render: function() {
      var rows = this.props.splits.map(function(split) {
        return (
          <tr key={split.idx}>
            <th className="split-index" scope="row">{split.idx}</th>
            <td className="split-time">{split.t.format("HH:mm:ss.S")}</td>
            <td className="split-bib" onClick={this.onClickInBib}>-</td>          
          </tr>
        );
      });
      return (
        <table className="table split-list">
          <tbody>
            {rows}
          </tbody>
        </table>  
      );
    },

    render: function() {

      var self = this;
      var selectedSplit = this.state.selectedSplit;
      var bib = function(split) {
        console.log("RENDER", split);
        var bibName = split.unsavedBib;
        if (selectedSplit == split) {
          return (
            <form onSubmit={onSubmit(split)}>
              <input value={split.unsavedBib} 
                onChange={onChange(split)}
                onBlur={onBlur(split)}
                size={5}
                ref="selectedBibField" 
              />
            </form>
          );
        } else {
          if (split.bib) {
            return (<span>{split.bib}</span>);
          } else {
            return (<span className="unknown-bib">???</span> );
          }
        }
      };
      var onClick = function(split) {
        return function() {
          split.unsavedBib = split.bib;
          self.setState({selectedSplit: split});
        }
      };
      var onChange = function(split) {
        return function(e) {
          console.log("ON CHANGE", split, e);
          split.unsavedBib = e.target.value;
          console.log("ON CHANGE2", split, e);
          self.setState({selectedSplit: split});
        }
      };
      var onSubmit = function(split) {
        return function(e) {
          console.log("ON SUBMIT", split);
          split.bib = split.unsavedBib;
          console.log("ON SUBMIT2", split);
          delete split.unsavedBib;
          console.log("ON SUBMIT3", split);
          self.setState({selectedSplit: null});
          e.preventDefault();
        }
      };
      var onBlur = function(split) {
        return function(e) {
         delete split.unsavedBib;
         self.setState({selectedSplit: null});
        }
      };

      var rows = this.props.splits.map(function(split) {
        return (
          <div className="row" key={split.idx}>
            <div className="col-xs-2 split-index">{split.idx}</div>
            <div className="col-xs-5 split-time">{split.t.format("HH:mm:ss.S")}</div>
            <div className="col-xs-5 split-bib" onClick={onClick(split)}>
              {bib(split)}
            </div>          
          </div>
        );
      });
      return (
        <div className="split-list split-list-div">
          {rows}
        </div>  
      );
    }


  });
})();

//React.render(
//  <RunningClock tickInterval={1000} />,
//  document.getElementById('content')
//);