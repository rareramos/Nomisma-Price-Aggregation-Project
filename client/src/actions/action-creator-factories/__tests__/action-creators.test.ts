import {
  emptyActionCreator,
  payloadActionCreator,
} from '../index';

test('empty action creator test', () => {
  const creator = emptyActionCreator('HELLO_WORLD');
  expect(creator()).toMatchObject({ type: 'HELLO_WORLD' });
});

test('payload action creator test', () => {
  const creator = payloadActionCreator<'HELLO_WORLD', number>('HELLO_WORLD');
  expect(creator(10)).toMatchObject({ type: 'HELLO_WORLD', data: 10 });
});
