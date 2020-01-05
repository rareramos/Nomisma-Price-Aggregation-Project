import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// here we setup fetch polyfill for jest to understand window.fetch
// https://github.com/facebook/jest/issues/2071
import 'whatwg-fetch';

Enzyme.configure({ adapter: new Adapter() });
