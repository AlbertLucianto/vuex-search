import composeSearchActions from './composeMapActions';
import composeSearchGetters from './composeMapGetters';

export default (name, base) => ({
  mapSearchActions: composeSearchActions(name, base),
  mapSearchGetters: composeSearchGetters(name, base),
});
