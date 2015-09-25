(function() {
  console.log("APP", C);

  var Main = React.createClass({
    render: function() {
      return (
        <div >
          <C.NavHeader/>
          <C.RunningClock tickInterval={1000} />
        </div>
      );
    }
  });

  window.onbeforeunload = function() {
    return "You're about to leave, are you sure?";
  } 

  React.initializeTouchEvents(true);
  React.render(<Main/>, document.getElementById('main'));
})();
