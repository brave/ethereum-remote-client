import React, { Component } from "react";

class TransformText extends Component {
  state = {
    text: this.props.text
  };

  componentDidMount() {
    const { uppercase, slice, replace } = this.props;
    if (uppercase) this.setState({ text: this.state.text.toUpperCase() });

    if (slice)
      this.setState({
        text: this.state.text.slice(slice[0], slice[1])
      });

    if (replace)
      this.setState({
        text: this.state.text.replace(replace[0], replace[1])
      });
  }

  render() {
    return this.state.text;
  }
}

export default TransformText;