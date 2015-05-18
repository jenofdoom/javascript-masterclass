var App = React.createClass({
  getInitialState: function() {
    return {
      showLobby: false,
      showNoRoom: false,
      showRoom: false
    };
  },
  componentDidMount: function() {
    var reactApp = this;
    var initialUrl = document.location.pathname.substring(1); // remove preceeding /

    socket.on('join room', function(roomData, isOwner){
      if (roomData && roomData.active) {
        reactApp.setState({
          showLobby: false,
          showRoom: true,
          roomId: roomData.hash,
          roomOwner: isOwner,
          question: roomData.question,
          answers: roomData.answers
        });

        window.history.pushState(
          {"room": roomData.hash},
          "Room " + roomData.hash,
          roomData.hash
        );
      } else {
        reactApp.setState({
          showLobby: false,
          showNoRoom: true
        });
      }
    });

    socket.on('set question', function(roomId, question, answers){
      if (roomId === reactApp.state.roomId) {
        reactApp.setState({
          question: question,
          answers: answers
        });
      }
    });

    // try to join/create room via url hash on init
    if (initialUrl) {
      socket.emit('join room', initialUrl);
    } else {
      reactApp.setState({showLobby: true});
    }
  },
  render: function() {
    return (
      <div>
        <Room showRoom={this.state.showRoom} roomId={this.state.roomId} isOwner={this.state.roomOwner} question={this.state.question} answers={this.state.answers} noQuestion="A question has not yet been set" />
        <LobbyControls showLobby={this.state.showLobby}/>
        <NoRoom showNoRoom={this.state.showNoRoom} />
      </div>
    );
  }
});