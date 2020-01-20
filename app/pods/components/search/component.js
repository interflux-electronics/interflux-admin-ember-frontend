import Component from '@glimmer/component';

export default class ReusablesSearchComponent extends Component {
}

// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Input } from 'components/reusables';
//
// class Search extends Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       query: props.query, // the text entered by the user
//       selected: undefined, // the selected options, with optional default value
//       highlight: 0, // the index of option that is to be highlighted
//       focus: false
//     };
//
//     this.onChange = this.onChange.bind(this);
//     this.onKeyDown = this.onKeyDown.bind(this);
//     this.onBlur = this.onBlur.bind(this);
//     this.onBodyClick = this.onBodyClick.bind(this);
//
//     this.wrapper = React.createRef();
//   }
//
//   onChange(event) {
//     const query = event.target.value;
//
//     // Set the value shown in the <input>
//     // Highlighting the first option
//     this.setState({ query, highlight: 0 });
//
//     // Important, here we fire up the search query to the parent component who
//     // will handle the async request for us and give back the options to render.
//     // This component only cares about managing the input and dropdown, not the
//     // network request because those are always case specific (not reusable).
//     this.props.onChange(query);
//   }
//
//   highlight(i) {
//     const highlight = i;
//     this.setState({ highlight });
//   }
//
//   select(option) {
//     this.props.onSelect(option);
//     document.activeElement.blur();
//     this.setState({
//       selected: option,
//       query: this.labelFor(option),
//       highlight: 0,
//       focus: false
//     });
//   }
//
//   // Though search options passed into <Search> can be deeply nested objects,
//   // we will only show one of it's property to the user. To choose which property,
//   // we pass in `optionLabel`. Use dots to dive into nested values.
//   // Examples:
//   // "streetname"
//   // "address.suburb.postcode"
//   // "person.lastName"
//   labelFor(option) {
//     if (!option) {
//       return null;
//     }
//     const { optionLabel } = this.props;
//     const keys = optionLabel.split('.');
//     return keys.reduce((acc, value) => {
//       return acc[value];
//     }, option);
//   }
//
//   componentDidMount() {
//     document.addEventListener('mousedown', this.onBodyClick, false); // Gotcha: fails in endorsements if attached to window
//   }
//
//   componentWillUnmount() {
//     document.removeEventListener('mousedown', this.onBodyClick, false); // Gotcha: fails in endorsements if attached to window
//   }
//
//   // Listen for updates of the value, if it does then update query
//   componentDidUpdate(prevProps) {
//     if (this.props.value !== prevProps.value) {
//       this.setState({ query: this.props.value });
//     }
//   }
//
//   // Hide the dropdown as soon as to user clicks anywhere on the page, except
//   // when the click occurred within this component.
//   onBodyClick(event) {
//     const clickedInside = this.wrapper.current.contains(event.target);
//     this.setState({ focus: clickedInside });
//   }
//
//   // Capture UP, DOWN and ENTER
//   onKeyDown({ key }) {
//     const ignore = !['Enter', 'ArrowUp', 'ArrowDown'].includes(key);
//     if (ignore) {
//       return;
//     }
//
//     const { highlight } = this.state;
//     const { options } = this.props;
//     const max = options.length - 1;
//     const i = highlight;
//
//     if (key === 'Enter') {
//       this.select(options[highlight]);
//     }
//     if (key === 'ArrowUp') {
//       const ii = i - 1 < 0 ? max : i - 1;
//       this.setState({ highlight: ii });
//     }
//     if (key === 'ArrowDown') {
//       const ii = i + 1 > max ? 0 : i + 1;
//       this.setState({ highlight: ii });
//     }
//   }
//
//   onBlur() {
//     this.props.onBlur();
//   }
//
//   render() {
//     const { query, highlight, selected, focus } = this.state;
//     const {
//       options,
//       isFetching,
//       fetchFailed,
//       placeholder,
//       disabled,
//       validation,
//       testId
//     } = this.props;
//
//     const label = this.labelFor(selected);
//     const showDropdown = focus && query && query !== label;
//
//     const renderDropdown = () => {
//       if (!showDropdown) {
//         return;
//       }
//       return (
//         <div className="dropdown">
//           <ul>{renderResults()}</ul>
//         </div>
//       );
//     };
//
//     const renderResults = () => {
//       if (isFetching) {
//         return <li>{`Searching ...`}</li>;
//       }
//       if (fetchFailed) {
//         return <li>{`Sorry, something went wrong ...`}</li>;
//       }
//       if (!options) {
//         return <li>{`Sorry, could not find "${query}"`}</li>;
//       }
//
//       let dom = [];
//       options.forEach((option, i) => {
//         const label = this.labelFor(option);
//         dom.push(
//           <li
//             key={i}
//             className={highlight === i ? 'active' : 'idle'}
//             onClick={() => {
//               this.select(option);
//             }}
//             onMouseOver={() => {
//               this.highlight(i);
//             }}
//           >
//             {label}
//           </li>
//         );
//       });
//       return dom;
//     };
//
//     const className = 'search-wrapper' + (showDropdown ? ' show-dropdown' : '');
//
//     return (
//       <div className={className} ref={this.wrapper}>
//         <Input
//           type="text"
//           icon="search"
//           placeholder={placeholder}
//           value={query}
//           onChange={this.onChange}
//           onKeyDown={this.onKeyDown}
//           onBlur={this.onBlur}
//           selectOnFocus={true}
//           disabled={disabled}
//           validation={validation}
//           testId={testId}
//         />
//         {renderDropdown()}
//       </div>
//     );
//   }
// }
//
// const { func, array, string, bool, oneOf } = PropTypes;
//
// Search.propTypes = {
//   // Data down
//   value: string,
//   options: array,
//   optionLabel: string,
//   fetchFailed: bool,
//   isFetching: bool,
//   placeholder: string,
//   disabled: bool,
//   validation: oneOf(['idle', 'valid', 'error']),
//   testId: string,
//
//   // Actions up
//   onChange: func,
//   onSelect: func,
//   onBlur: func
// };
//
// export default Search;
