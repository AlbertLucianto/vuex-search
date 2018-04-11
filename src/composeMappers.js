import composeSearchActions from './composeMapActions';
import composeSearchGetters from './composeMapGetters';

export default name => ({
  mapSearchActions: composeSearchActions(name),
  mapSearchGetters: composeSearchGetters(name),
});
